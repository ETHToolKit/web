import { Component, OnInit, Input } from '@angular/core';
import { GlobalContextService } from '../../../services/globalContext.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContextWorkerService } from 'src/app/services/contextWorker.service';
import { MatStep } from '@angular/material';


@Component({
  selector: 'tokenInfo',
  templateUrl: './tokenInfo.component.html',
  styleUrls: ['./tokenInfo.component.css']
})
export class TokenInfoComponent implements OnInit {

  public decimals:number = 18;
  public symbol:string;
  loadingTokenData: boolean = false;
  firstFormGroup: FormGroup;
  public getTokenError:string;

  @Input() public step:MatStep;


  constructor(
    private _formBuilder: FormBuilder,
    private contextWorker:ContextWorkerService,
    public context:GlobalContextService) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
  }

  public async addressChanged(address: any) {
    this.context.reset();
    this.loadingTokenData = true;

    try {
        this.getTokenError = null;
        await this.contextWorker.getToken(address);
        
        this.decimals = this.context.erc20.token.decimals;
        this.symbol = this.context.erc20.token.symbol;
        this.step.completed = true;

    } catch (e) {
        console.log(e);
        this.getTokenError = e;
    }

    this.loadingTokenData = false;
}

  public reset() {
    this.decimals = 18;
    this.symbol = null;
    this.firstFormGroup.reset();
    this.step.completed = false;
  }

}
