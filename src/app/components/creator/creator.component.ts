import { Component, OnInit, ViewChild } from '@angular/core';
import { EthereumService } from '../../services/ethereum.service';
import { environment } from '../../../environments/environment';
import { Dropper } from '../../core/contracts/dropper';
import { DropperContextService } from '../../services/dropperContext.service';
import { DataImporterComponent } from '../controls/dataImporter/dataImporter.component';
import { ServiceEvent } from '../../models/serviceEvent';
import { TokenInfoComponent } from '../controls/tokenInfo/tokenInfo.component';
import { DropConfigComponent } from '../controls/dropConfig/dropConfig.component';
import { DropPackageComponent } from '../controls/dropPackage/dropPackage.component';
import { MatStepper, MatStep } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContractFactory } from 'src/app/core/contracts/contractFactory';
import { TransactionTracker } from 'src/app/core/transactionTracker';




@Component({
    selector: 'creator',
    templateUrl: './creator.component.html'
})
export class CreatorComponent implements OnInit {

    public tokenType = "standard";
    public decimals: number = 18;
    public symbol: string;
    public name: string;
    public totalSupply: number;
    public status = 0;
    public transactionTx = null;
    public error = null;

    public donation: number;

    fromGroupCreator: FormGroup;

    public factory: ContractFactory;

    @ViewChild(MatStep) stepTwoCreator: MatStep;

    constructor(
        private _formBuilder: FormBuilder,
        private _ethereumService: EthereumService) {
        this._ethereumService.OnStateChanged().subscribe((result) => this.handleStateChanged(result));

        this.fromGroupCreator = this._formBuilder.group({

        });


    }

    async ngOnInit() {

    }

    public tokenTypeChanged(event: any) {
        this.reset();
    }

    public nameChange() {
    }

    public symbolChange() {
    }

    public totalSupplyChange() {
    }

    public async deploy() {
        var tx;
        this.status = 1;

        if (this.tokenType == 'standard') {

            var params = this.factory.createTokenParams(this.decimals, this.name, this.symbol,
                this._ethereumService.getAccount(), false, this.totalSupply);
            tx = await this.factory.createContract("MintableToken", params, this.donation);

        } else {
            var params = this.factory.createTokenParams(this.decimals, this.name, this.symbol,
                this._ethereumService.getAccount(), false, 0);
            tx = await this.factory.createContract("MintableToken", params, this.donation);
        }

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
                    }
                }
            });

    }

    public canGoNext() {

        if (this.tokenType == 'standard') {
            var canGo = this.name != null && this.symbol != null && this.totalSupply != null;
            return canGo;
        }
        else {
            var canGo = this.name != null && this.symbol != null;
            return canGo;
        }

    }

    public handleStateChanged(data) {
        if (data.event == ServiceEvent.AccountChanged) {
            this.reset();
        }

        if (data.isReady) {
            if (this._ethereumService.isMainnet())
                this.factory = new ContractFactory(environment.contractFactoryMainnet, this._ethereumService);
            else
                this.factory = new ContractFactory(environment.contractFactory, this._ethereumService);
        }
    }

    public reset() {

        this.decimals = 18;
        this.symbol = null;
        this.name = null;
        this.totalSupply = null;
        this.status = 0;
        this.transactionTx = null;
        this.donation = null;
        this.error = null;
    }
}
