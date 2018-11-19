import { Injectable } from "@angular/core";
import { ERC20 } from "../core/erc20";
import { Dropper } from "../core/dropper";
import { EthereumService } from "./ethereum.service";
import { AirdropDataService } from "./airdropData.service";
import { TokenData } from "../models/tokenData.model";
import { Airdrop } from "../models/airdrop.model";
import { AirdropWorker } from "../core/airdropWorker";

@Injectable()
export class GlobalContextService {

    protected state: ContextState;

    public dropper: Dropper;
    public erc20:ERC20;
  
    public payableMethod: any = 'none';

    public tokenData:TokenData;
    public airdrop:Airdrop;

    public airdropWorkers :Array<AirdropWorker>;

    constructor(private _ethereumService: EthereumService,
        private _airdropDataService: AirdropDataService) {
            
        this.reset();
    }
    public updateState(_state: ContextState
        
        ) {
        this.state = _state;
       
    }
   
    public reset() {
        this.tokenData = new TokenData();
        this.airdrop = new Airdrop();

        this.airdropWorkers = null;
        this.erc20 = null;
      
        this.payableMethod = 'none';
        this.state = ContextState.Cleared;
      
    }

    public isCleared() {
        return this.state == ContextState.Cleared;
    }
}

export enum ContextState {
    Cleared,
    Initialized
} 