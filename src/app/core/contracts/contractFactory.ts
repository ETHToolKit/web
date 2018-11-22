import { EthereumService } from '../../services/ethereum.service';
import BigNumber from 'bignumber.js';
declare let require: any;

const factoryABI: any = require('../../../assets/ContractFactory.json');
const mintableTokenABI: any = require('../../../assets/templates/MintableTokenTemplate.json');

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

  public async createContract( _type: string , _params:string, _value:number): Promise<any> {
    return new Promise((resolve, reject) => {

      var transactionObject = {
        from: this._ethereum.getAccount(),
        gas:1800000,
        value:"0"
      };

      if(_value > 0 ) 
        transactionObject.value = new BigNumber(10).pow(18).multipliedBy(_value).toString();

      this.contractInstance.createContract(_type, _params, transactionObject, (err, result) => { 
        if (err != null) {
          console.log(JSON.stringify(err));
          reject(err);
        }else
          resolve(result);
      });
    });
  }

  public createTokenParams(
    decimals:number, 
    name:string,
    symbol:string,
    newOwner:string,
    finishMinting:boolean,
    initSupply:number):string {
    var tokenContract = this._ethereum.web3.eth.contract(mintableTokenABI);
    var tokenInstance = tokenContract.at("0x0");

    var totalSupply = new BigNumber(initSupply).multipliedBy(new BigNumber(10).pow(decimals));

    return tokenInstance.init.getData(decimals, name, symbol, newOwner, finishMinting, totalSupply.toString());

  }
}
