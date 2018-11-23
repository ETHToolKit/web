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
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ContractFactory } from 'src/app/core/contracts/contractFactory';
import { TransactionTracker } from 'src/app/core/transactionTracker';
import { EtherscanService } from 'src/app/services/etherscan.service';




@Component({
    selector: 'creator',
    templateUrl: './creator.component.html'
})
export class CreatorComponent implements OnInit {

    public tokenType = "standard";

    public status = 0;
    public transactionTx = null;
    public error = null;
    public newTokenAddress = null;
    public newTokenAddressHref = null;


    @ViewChild(MatStep) stepTwoCreator: MatStep;
    @ViewChild(MatStep) stepOneCreator: MatStep;
    @ViewChild(MatStep) stepThreeCreator: MatStep;

    stepTwoCreatorForm: FormGroup;

    constructor(
        private _formBuilder: FormBuilder,
        private _etherescanService:EtherscanService,
        private _ethereumService: EthereumService) {
        this._ethereumService.OnStateChanged().subscribe((result) => this.handleStateChanged(result));

        this.stepTwoCreatorForm = this._formBuilder.group({
            name: ['', Validators.required],
            symbol: ['', Validators.required],
            totalSupply: [1000000, Validators.required,],
            decimals: [18, [Validators.required, Validators.max(77), Validators.min(0)]],
            donation: [''],
        });
    }

    async ngOnInit() {

    }

    public tokenTypeChanged(event: any) {
        this.reset();

        if (this.tokenType != 'standard') {
            this.stepTwoCreatorForm.removeControl("totalSupply");
        }
        else {
            this.stepTwoCreatorForm.addControl("totalSupply", new FormControl('', Validators.required))
        }

    }

    public async deploy() {

        try {
            var tx;
            this.status = 1;

            var decimals = this.stepTwoCreatorForm.controls.decimals.value;
            var name = this.stepTwoCreatorForm.controls.name.value;
            var totalSupply = this.stepTwoCreatorForm.controls.totalSupply.value;
            var symbol = this.stepTwoCreatorForm.controls.symbol.value;
            var donation = this.stepTwoCreatorForm.controls.donation.value;

            var factory = this.getFactoryInstance();

            var params = factory.createTokenParams(decimals, name, symbol,
                this._ethereumService.getAccount(), this.tokenType == 'standard', totalSupply);
            tx = await factory.createContract("MintableToken", params, donation);

            this.transactionTx = this._etherescanService.getTransactionLink(tx);

            new TransactionTracker(tx, this._ethereumService, 180, 0, async (err, result) => {
                if (err) {
                    this.status = 3;
                    this.error = err;
                    console.log(err);
                }
                else {
                    if (result.ready) {
                        this.status = 2;
                        this.newTokenAddress = result.recipe.logs[0].address;
                        this.newTokenAddressHref = 
                            this._etherescanService.getAddressLink(this.newTokenAddress);

                    }
                }
            });
        }
        catch (ex) {
            this.status = 3;
            this.error = ex;
        }

    }

    public getFactoryInstance(): ContractFactory {

        if (this._ethereumService.isMainnet())
            return new ContractFactory(environment.contractFactoryMainnet, this._ethereumService);
        else
            return new ContractFactory(environment.contractFactory, this._ethereumService);

    }

    public handleStateChanged(data) {
        if (data.event == ServiceEvent.AccountChanged) {
            this.reset();
        }

        if (data.isReady) {

        }
    }

    public reset() {
        if (this.stepTwoCreatorForm) {
            this.stepTwoCreatorForm.controls.decimals.setValue(18);
            this.stepTwoCreatorForm.controls.totalSupply.setValue(1000000);
        }
        this.status = 0;
        this.transactionTx = null;
        this.newTokenAddressHref = null;
        this.newTokenAddress = null;
        this.error = null;
    }
}
