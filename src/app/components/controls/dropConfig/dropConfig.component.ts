import { Component, OnInit, Input} from '@angular/core';
import { DropperContextService } from '../../../services/dropperContext.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EthereumService } from 'src/app/services/ethereum.service';
import { TransactionTracker } from 'src/app/core/transactionTracker';

import { environment } from '../../../../environments/environment';
import { ContextWorkerService } from 'src/app/services/contextWorker.service';
import { MatStep } from '@angular/material';


@Component({
  selector: 'dropConfig',
  templateUrl: './dropConfig.component.html',
  styleUrls: ['./dropConfig.component.css']
})
export class DropConfigComponent implements OnInit {

  public allowanceStatus = 0;
  thirdFormGroup: FormGroup;
  public approveTx:string;

  public donationCurrency:string;

  @Input() public step:MatStep;

  public environemntLocal = environment;

  constructor(
    private _formBuilder: FormBuilder,
    public context: DropperContextService,
    private worker:ContextWorkerService,
    private _ethereumService: EthereumService) { }

  ngOnInit() {
    this.thirdFormGroup = this._formBuilder.group({
      //thirdCtrl: ['', Validators.required],
    });

    this.context.payableMethod = 'none';

    this.step.completed = !this.isApproveButtonRequired();
  }

  public onDonationValueChanged() {
    this.worker.rebuildPackages();
    this.allowanceStatus = 0;
  }

  public async updatePackageSize(event:any) {
     this.worker.rebuildPackages();
     this.allowanceStatus = 0;
  }

  public donationChange(event:any) {
    if(this.context.payableMethod == 'eth')
      this.donationCurrency = "ETH";
    else if(this.context.payableMethod == 'token')
      this.donationCurrency = this.context.erc20?this.context.erc20.token.symbol:"";
    else {
      this.donationCurrency = null;
      this.context.airdrop.donation = null;
    }

    this.worker.rebuildPackages();
    this.allowanceStatus = 0;
  }

  public async approve() {
    var value = 
      this.context.airdrop.airdropData.totalToDropRaw;


    try {
      this.allowanceStatus = 1;
      var tx = await this.context.erc20.approve(this.context.dropper.address, value);

      if(this._ethereumService.isMainnet())
        this.approveTx = environment.etherscanTxMainnet + tx;
      else
        this.approveTx = environment.etherscanTx + tx;
      
      new TransactionTracker(tx, this._ethereumService, 180, 1, async (err, result) => {
        if (err) {
          console.error(err);
        }
        else {
          if (result.ready) {
            this.context.tokenData.allowanceRaw = await this.context.erc20.allowance(this._ethereumService.getAccount(), environment.dropperAddress);
            this.allowanceStatus = 2;
          }
        }

      });
    }
    catch (ex) {
      this.allowanceStatus = 3;
      console.error(ex);
    }
  }

  public isApproveButtonRequired() {
    var isButtonRequired = true;
    if (this.context.airdrop.airdropData) {
        isButtonRequired = this.context.airdrop.airdropData.totalToDropRaw.gt(this.context.tokenData.allowanceRaw);
    }
    this.step.completed = !isButtonRequired;
    return isButtonRequired;
  }


  public reset() {
    this.allowanceStatus = 0;
    this.approveTx = null;
    this.donationCurrency = null;
    this.allowanceStatus = 0;
    this.step.completed = false;
    this.thirdFormGroup.reset();
  }

}
