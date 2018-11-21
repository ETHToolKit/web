import { Injectable } from '@angular/core';
import { EthereumService } from '../../services/ethereum.service';
import BigNumber from 'bignumber.js';

export class Dropper {

  protected contractInstance: any;

  public gasLimit: number;
  public gasPrice: BigNumber;

  constructor(
    public address: string,
    protected _ethereum: EthereumService,
    private _abi:any
  ) {

    var tokenContract = this._ethereum.web3.eth.contract(_abi);
    this.contractInstance = tokenContract.at(address);
  }

  public async getFees(account:string, token:string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contractInstance.getFees(account,token, function (err, result) {
        if (err != null) {
          console.log(JSON.stringify(err));
          reject(err);
        }
        else
          resolve(result);
      });
    });
  }

  public async drop( _erc20Address: string , _beneficiary:string[], _amount:string[], _totalAmount:string, _value:string): Promise<any> {
    return new Promise((resolve, reject) => {

      var transactionObject = {
        from: this._ethereum.getAccount(),
        value:"0"
      };

      if(_value) 
        transactionObject.value = _value

      this.contractInstance.drop(_erc20Address,_beneficiary, _amount ,_totalAmount, transactionObject, (err, result) => { 
        if (err != null) {
          console.log(JSON.stringify(err));
          reject(err);
        }else
          resolve(result);
      });
    });
  }
}
