import { EthereumService } from "../../services/ethereum.service";
import { ERC20Token } from '../../models/ERC20token.model';
import BigNumber from "bignumber.js";
declare let require: any;

const erc20ABI: any = require('../../../assets/erc20.json');

export class ERC20 {

  private contractInstance: any;
  public token: ERC20Token;

  private constructor(
    public readonly address: string,
    private _ethereum: EthereumService) {

    var tokenContract = this._ethereum.web3.eth.contract(erc20ABI);
    this.contractInstance = tokenContract.at(address);
  }

  public static async create(address: string, _ethereum: EthereumService) {
    var instance = new ERC20(address, _ethereum);
    var isValid = await instance.getTokenInfo();

    if (isValid)
      return instance;
    else
      return null;
  }

  private async getTokenInfo(): Promise<boolean> {

    let [totalSupply, name, symbol, decimals] = await Promise.all([
      this.getTotalSupply(), 
      this.getName(), 
      this.getSymbol(), 
      this.getDecimals()]);

    if (name == null)
      return false;
    else {
      this.token = new ERC20Token(name, symbol, totalSupply, decimals);
      return true;
    }

  }


  public async approve(_spender:string, _tokens:BigNumber): Promise<any> {
    return new Promise((resolve, reject) => {

      var transactionObject = {
        from: this._ethereum.getAccount(),
        gas: 50000,
        gasPrice: "5000000000"
      };

      this.contractInstance.approve(_spender, _tokens.toString(10), transactionObject, (err, result) => { 
        if (err != null) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  public async balanceOf(address: string): Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {
      this.contractInstance.balanceOf(address, function (err, result) {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(new BigNumber(result.toString()));
      });
    });
  }

  public async allowance(_tokenOwner:string, _spender:string) : Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {
      this.contractInstance.allowance(_tokenOwner, _spender, function (err, result) {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(new BigNumber(result.toString()));
      });
    });
  }

  private async getTotalSupply(): Promise<BigNumber> {
    return new Promise<BigNumber>((resolve, reject) => {
      this.contractInstance.totalSupply(function (err, result) {
        if (err != null) {
          reject(err);
        }
        else
          resolve(new BigNumber(result.toString()));
      });
    });
  }

  private async getName(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contractInstance.name(function (err, result) {
        if (err != null) {
          reject(err);
        }
        else
          resolve(result);
      });
    });
  }

  private async getSymbol(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contractInstance.symbol(function (err, result) {
        if (err != null) {
          reject(err);
        }
        else
          resolve(result);
      });
    });
  }

  private async getDecimals(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contractInstance.decimals(function (err, result) {
        if (err != null) {
          reject(err);
        }
        else
          resolve(result);
      });
    });
  }

  
}
