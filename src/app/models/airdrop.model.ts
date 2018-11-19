import BigNumber from "bignumber.js";
import { AirdropData } from "../core/airdropData";
import { AirdropItem } from "./airdropItem.model";

export class Airdrop {
    public airdropData: AirdropData;

    public airdropPackages:Array<AirdropData>;
    public packageSize:string = '75';
    
    public donation:number = 0;
    
}
