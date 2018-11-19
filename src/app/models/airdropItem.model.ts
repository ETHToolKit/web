import BigNumber from "bignumber.js";

export class AirdropItem {
    public id:number;
    public account: string;
    public balance: string;
    public balanceRaw: BigNumber;
    public isDonation:boolean = false;
    
    constructor(_account:string, _balance:string, _balanceRaw:BigNumber,_id:number ) {
        this.id = _id;
        this.account = _account;
        this.balance = _balance;
        this.balanceRaw = _balanceRaw;
    }
}
