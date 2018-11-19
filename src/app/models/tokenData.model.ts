import BigNumber from "bignumber.js";

export class TokenData {
    public tokenBalanceRaw: BigNumber= null;
    public allowanceRaw: BigNumber;

    public ethBonus:BigNumber;
    public tokenBonus:BigNumber;
}
