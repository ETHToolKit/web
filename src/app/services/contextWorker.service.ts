import { Injectable } from '@angular/core';
import { EthereumService } from './ethereum.service';
import { DropperContextService } from './dropperContext.service';
import { HelperService } from './helper.service';
import { ERC20 } from '../core/contracts/erc20';
import BigNumber from 'bignumber.js';
import { AirdropDataService } from './airdropData.service';
import { AirdropItem } from '../models/airdropItem.model';
import { AirdropWorker } from '../core/airdropWorker';

@Injectable()
export class ContextWorkerService {

  constructor(
    private context: DropperContextService,
    private _helper: HelperService,
    private _airdropDataService: AirdropDataService,
    private _ethereumService:EthereumService) { 

    }

    public async getToken(address: string) {
        if (this._helper.isAddress(address)) {
            try {
                this.context.erc20 = await ERC20.create(address, this._ethereumService);
            }
            catch(e) {
                throw "It is not a token"
            }

            if (this.context.erc20 == null) {
                throw "It is not a token";
            }
            else {
                
                let [allowance, tokenBalanceRaw] = await Promise.all([
                    this.context.erc20.allowance(this._ethereumService.getAccount(), this.context.dropper.address),
                    this.context.erc20.balanceOf(this._ethereumService.getAccount())]);
    
                this.context.tokenData.tokenBalanceRaw = tokenBalanceRaw;
                this.context.tokenData.allowanceRaw = allowance;
              
            }
        }
        else {
            throw "It is not an address.";
        }
    }

    public async parseData(data: any) {

        try {
            this.context.airdrop.airdropData = this._airdropDataService.parse(data, ";", this.context.erc20.token.decimals);
            this.rebuildPackages();
        }
        catch(e) {
            this.context.airdrop.airdropData = null;
            throw e;
        }

      

    }

    public rebuildPackages() {

        var index = this.context.airdrop.airdropData.items.findIndex((x) => x.isDonation);
        if(index >-1) 
            this.context.airdrop.airdropData.items.shift();
       
        if(this.context.payableMethod == 'token' && this.context.airdrop.donation > 0) {
            var value = new BigNumber(10).pow(this.context.erc20.token.decimals).multipliedBy(this.context.airdrop.donation);
            var item = new AirdropItem(this.context.dropper.address, this.context.airdrop.donation.toString(), value, 0);
            item.isDonation = true;

            this.context.airdrop.airdropData.items.unshift(item);
        }

        this.context.airdrop.airdropData.calculateBalance();

        this.context.airdrop.airdropPackages = this.context.airdrop.airdropData
            .getPackages(Number.parseInt(this.context.airdrop.packageSize));

        this.createWorkers();
    }

    public  createWorkers() {
        var pack = this.context.airdrop.airdropPackages;
        var data = new Array<AirdropWorker>() ;
        for(var i=0;i<pack.length;i++) {
            data.push(new AirdropWorker(this._ethereumService, pack[i], this.context, i==0));
        }

        this.context.airdropWorkers = data;
    }

  
}
