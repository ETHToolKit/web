import BigNumber from "bignumber.js";

export class ERC20Token {
    public name: string;
    public symbol: string;
    public totalSupply: BigNumber;
    public decimals:number;
    public totalSupplyRaw:BigNumber;

    constructor(_name:string, _symbol:string, _totalSupplyRaw:BigNumber, _decimals:number) {
        this.name = _name;
        this.symbol = _symbol;
        this.decimals = _decimals;
        this.totalSupplyRaw = _totalSupplyRaw;
    }
}
