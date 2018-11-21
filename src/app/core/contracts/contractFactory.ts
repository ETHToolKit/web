import { EthereumService } from '../../services/ethereum.service';
import BigNumber from 'bignumber.js';
declare let require: any;

const factoryABI: any = require('../../../assets/ContractFactory.json');

export class ContractFactory {

  protected contractInstance: any;

  public gasLimit: number;
  public gasPrice: BigNumber;

  constructor(
    public address: string,
    protected _ethereum: EthereumService
  ) {

    var contract = this._ethereum.web3.eth.contract(factoryABI);
    this.contractInstance = contract.at(address);
  }

  public async createContract( _type: string , _params:string, _value:string): Promise<any> {
    return new Promise((resolve, reject) => {

      var transactionObject = {
        from: this._ethereum.getAccount(),
        value:"0"
      };

      if(_value) 
        transactionObject.value = _value

      this.contractInstance.createContract(_type, _params, transactionObject, (err, result) => { 
        if (err != null) {
          console.log(JSON.stringify(err));
          reject(err);
        }else
          resolve(result);
      });
    });
  }
}
