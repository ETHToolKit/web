import { EthereumService } from "../services/ethereum.service";
import { interval,Subscribable, Subscription } from "rxjs";


export class TransactionTracker {
    private subscribtion: Subscription;

    private checkBlock = false;
    private txBlockNumber = 0;
    private txHashRecived = false;

    constructor(
        public txID: string,
        protected _ethereum: EthereumService,
        private timeout: number,
        private blockConfirmationNumber: number,
        public callback: any
    ) {

        this.subscribtion = interval(1000).subscribe(() => this.refreshStatus())
    }

    refreshStatus() {
        if (!this.checkBlock)
            this.readTransaction();
        else
            this.readBlock();
    }

    private readTransaction() {
        this._ethereum.web3.eth.getTransaction(this.txID, (err: any, result: any) => {
            if (err != null) {
                this.subscribtion.unsubscribe();
                this.callback("Cant get transaction", 1);
            }
            else if (result != null) {
                if (result.blockNumber) {
                    this.txBlockNumber = result.blockNumber;

                    this._ethereum.web3.eth.getTransactionReceipt(this.txID, (err: any, recipe: any) => {
                        console.log(recipe)
                        if (recipe.gasUsed < 100) {
                            this.subscribtion.unsubscribe();
                            this.callback("Code not executed. Out of gas.", null);
                        }
                        else if (recipe.status != 1) {
                            console.error("Revert");
                            this.subscribtion.unsubscribe();
                            this.callback("Execution failed", 1);
                        }
                        else {
                            if (this.blockConfirmationNumber == 0 ) {
                                if(result.blockNumber >= this.txBlockNumber) {
                                    this.subscribtion.unsubscribe();
                                    this.callback(null, {ready:true});
                                }
                            }
                            else
                                this.checkBlock = true;
                        }
                    });
                }
            }
            else if (this.timeout <= 0) {
                this.subscribtion.unsubscribe();
                this.callback("Timeout", null);
            }

            this.timeout--;
        });
    }

    private readBlock() {
        this._ethereum.web3.eth.getBlock("latest", (err: any, result: any) => {
            if (err) {
                this.subscribtion.unsubscribe();
                this.callback(err, 1);
            }
            else {
                if (this.txBlockNumber + this.blockConfirmationNumber <= result.number) {
                    this.subscribtion.unsubscribe();
                    this.callback(null, {confirmedBlock:(result.number-this.txBlockNumber), requiredBlock:this.blockConfirmationNumber,ready:true});
                }
                else {
                    var confirm = result.number-this.txBlockNumber;
                    confirm = confirm<0?0:confirm;    
                    this.callback(null, {confirmedBlock:confirm, requiredBlock:this.blockConfirmationNumber,ready:false});
                }
            }
        });
    }

}
