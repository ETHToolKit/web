import { EthereumService } from "../services/ethereum.service";
import { TransactionTracker } from "./transactionTracker";
import { AirdropData } from "./airdropData";
import { DropperContextService } from "../services/dropperContext.service";
import BigNumber from "bignumber.js";
import { environment } from '../../environments/environment';

export class AirdropWorker {

    public transactionTx: string;
    public blockNumber: number;
    public status: number = 0;

    public error: string;

    constructor(
        private _ethereumService: EthereumService,
        public data: AirdropData,
        private _context: DropperContextService,
        public addDonation: boolean
    ) {

    }

    public async runAirdrop() {
        this.status = 1;
        this.error = null;

        try {
            var value = new BigNumber(0);

            if (this._context.payableMethod == 'eth' && this._context.airdrop.donation > 0 && this.addDonation)
                value = new BigNumber(10).pow(18).multipliedBy(this._context.airdrop.donation);


            var flatData = this.data.getFlatData();

            var tx = await this._context.dropper.drop(
                this._context.erc20.address,
                flatData.accounts,
                flatData.balances,
                this.data.totalToDropRaw.toString(10),
                value.toString(10));

            if (this._ethereumService.isMainnet())
                this.transactionTx = environment.etherscanTxMainnet + tx;
            else
                this.transactionTx = environment.etherscanTx + tx;


            new TransactionTracker(tx, this._ethereumService, 180, 0, async (err, result) => {
                if (err) {
                    this.status = 3;
                    this.error = err;
                    console.log(err);
                }
                else {
                    if (result.ready) {
                        this.status = 2;
                        this._context.tokenData.allowanceRaw = await this._context.erc20.allowance(this._ethereumService.getAccount(), environment.dropperAddress);
                    }
                }
            });
        }
        catch (ex) {
            console.error(ex);
            this.error = ex;
            this.status = 3;
        }

    }


}
