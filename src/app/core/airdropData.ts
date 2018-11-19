import { AirdropItem } from "../models/airdropItem.model";
import BigNumber from "bignumber.js";

export class AirdropData {
    public items:AirdropItem[];
    public totalToDropRaw:BigNumber;
    
    constructor(_items:AirdropItem[]) {
        this.items = _items;
        this.calculateBalance();
    }

    public calculateBalance() {
        var rawBalanceSum = new BigNumber(0);
        for(var i=0;i<this.items.length;i++) {
            rawBalanceSum = rawBalanceSum.plus(this.items[i].balanceRaw);
        }

        this.totalToDropRaw = rawBalanceSum;
    }

    public getPackages(packageSize:number):Array<AirdropData> {
        var data : Array<AirdropData> = new Array<AirdropData>();

        for(var i=0;i<this.items.length;i+=packageSize) {
            var pack = this.items.slice(i, i+packageSize);
            data.push(new AirdropData(pack));
        }

        return data;
    }

    public getFlatData() {
        var balances = [];
        var accounts = [];
        for(var i=0 ; i<this.items.length;i++) {
            balances.push(this.items[i].balanceRaw.toString(10));
            accounts.push(this.items[i].account)
        };

        return {
            balances: balances,
            accounts:accounts
        };
    }
}
