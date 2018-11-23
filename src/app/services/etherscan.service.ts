import { interval, BehaviorSubject, Subscription, timer, Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import * as Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { ServiceEvent } from '../models/serviceEvent';
import { EthereumService } from './ethereum.service';

declare let Web3: any;
declare let window: any;
declare let location: any;


@Injectable()
export class EtherscanService {

    public RINKEBY_LINK = "https://rinkeby.etherscan.io/";
    public MAINNET_LINK = "https://etherscan.io/";

    constructor(private _ethereumService:EthereumService) {
        
    }

    public getTransactionLink(tx:string) {
        return this.getNetworkLink() + "tx/" + tx;
    }

    public getAddressLink(address:string) {
        return this.getNetworkLink() + "address/" + address;
    }

    private getNetworkLink():string {
        var prefix;
        switch(this._ethereumService.getNetwork()) {
            case 'mainnet' : {prefix = this.MAINNET_LINK;break;}
            case 'rinkeby' : {prefix = this.RINKEBY_LINK;break;}
            default: {}
        }

        return prefix;
    }
   
}