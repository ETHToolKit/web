import { Injectable } from "@angular/core";
import { ERC20 } from "../core/contracts/erc20";
import { Dropper } from "../core/contracts/dropper";
import { EthereumService } from "./ethereum.service";
import { AirdropDataService } from "./airdropData.service";
import { TokenData } from "../models/tokenData.model";
import { Airdrop } from "../models/airdrop.model";
import { AirdropWorker } from "../core/airdropWorker";
import BigNumber from "bignumber.js";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import tmpl from 'blueimp-tmpl';
// import solc from 'solc';

declare let require: any;
declare let location: any;

const factoryABI: any = require('./../../assets/ContractFactory.json');
const mintableTokenABI: any = require('../../assets/templates/MintableTokenTemplate.json');


@Injectable()
export class ContractFactoryService {

    tokenTemplate:string;

    constructor(
        private _ethereum: EthereumService,
        private http: HttpClient
    ) {

    }

    private getFactoryInstane(): any {
        var contract = this._ethereum.web3.eth.contract(factoryABI);

        if (this._ethereum.isMainnet())
            return contract.at(environment.contractFactoryMainnet);
        else
            return contract.at(environment.contractFactory);

    }

    //test for online compiling
    public async createFullToken(tokenParams:any) {
        var path =  "assets/templates/Token.sol"; //location.origin + "/"
        var codeTemplate = await this.getCodeTemplate(path);
        
        var contractCode = tmpl(codeTemplate, {
            mintableToken:true,
            burnableToken:false
        });
        
        // var byte = solc.compile(contractCode, 0);
        // console.log(byte);
    }

    private async getCodeTemplate(path:string) {
        const option = {responseType: 'text' as 'text'};
        return await this.http.get(path, option).toPromise();
    }


    public createTokenParams(
        decimals: number,
        name: string,
        symbol: string,
        newOwner: string,
        finishMinting: boolean,
        initSupply: number): string {
        var tokenContract = this._ethereum.web3.eth.contract(mintableTokenABI);
        var tokenInstance = tokenContract.at("0x0");

        var totalSupply = new BigNumber(initSupply).multipliedBy(new BigNumber(10).pow(decimals));

        return tokenInstance.init.getData(decimals, name, symbol, newOwner, finishMinting, totalSupply.toString());

    }

    public async createContract(_type: string, _params: string, _value: number): Promise<any> {
        return new Promise((resolve, reject) => {

            var transactionObject = {
                from: this._ethereum.getAccount(),
                gas: 1800000,
                value: "0"
            };

            if (_value > 0)
                transactionObject.value = new BigNumber(10).pow(18).multipliedBy(_value).toString();

            this.getFactoryInstane().createContract(_type, _params, transactionObject, (err, result) => {
                if (err != null) {
                    console.log(JSON.stringify(err));
                    reject(err);
                } else
                    resolve(result);
            });
        });
    }

}
