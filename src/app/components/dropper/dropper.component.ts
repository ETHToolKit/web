import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EthereumService } from '../../services/ethereum.service';
import { ERC20 } from '../../core/erc20';
import { environment } from '../../../environments/environment';
import { Dropper } from '../../core/dropper';
import { GlobalContextService} from '../../services/globalContext.service';
import { DataImporterComponent } from '../controls/dataImporter/dataImporter.component';
import { ServiceEvent } from '../../models/serviceEvent';
import { TokenInfoComponent } from '../controls/tokenInfo/tokenInfo.component';
import { DropConfigComponent } from '../controls/dropConfig/dropConfig.component';
import { DropPackageComponent } from '../controls/dropPackage/dropPackage.component';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

declare let require: any;

const abi: any = require('../../../assets/TokenDropper.json');


@Component({
    selector: 'dropper',
    templateUrl: './dropper.component.html',
    styleUrls: ['./dropper.component.css']
})
export class DropperComponent implements OnInit {

    noMetamask: boolean = false;
    noAccount: boolean = true;
    loading: boolean = true;
    notSupportedNetwork: boolean = false;
    showIntroduction:boolean = true;

    @ViewChild(DataImporterComponent) dataImporter: DataImporterComponent;
    @ViewChild(TokenInfoComponent) tokenInfo: TokenInfoComponent;
    @ViewChild(DropConfigComponent) dropConfig: DropConfigComponent;
    @ViewChild(DropPackageComponent) dropPackage: DropPackageComponent;
    @ViewChild(MatStepper) stepper:MatStepper;

    constructor(
        public context: GlobalContextService,
        private _ethereumService: EthereumService) {

        this._ethereumService.OnStateChanged().subscribe((result) => this.handleStateChanged(result));
    }

    async ngOnInit() {
        
    }

    public start() {
        this.showIntroduction = false;
    }

    public handleStateChanged(data) {
        if (data.event == ServiceEvent.Idle) {
            //this.loadingEth = true;
        }
        else if (data.event == ServiceEvent.AccountChanged) {
            this.reset();
            this.noAccount = false;
            this.noMetamask = false;
            this.loading = false;
        }
        else if (data.event == ServiceEvent.AccountNotFound) {
            this.noAccount = true;
            this.loading = false;
        }
        else if (data.event == ServiceEvent.MetamaskNotDetected) {
            this.noMetamask = true;
            this.loading = false;
        }
        else if (data.event == ServiceEvent.MetamaskDetectedWrongNetwork) {
            this.loading = false;
            this.notSupportedNetwork = true;
            this.showIntroduction = false;
        }
        else if (data.event == ServiceEvent.MetamaskDetected) {
            if(this._ethereumService.getNetwork().toLowerCase() =="rinkeby")
                this.context.dropper = new Dropper(environment.dropperAddress, this._ethereumService, abi);
            else 
                this.context.dropper = new Dropper(environment.dropperAddressMainnet, this._ethereumService, abi);

            this.noMetamask = false;
            this.showIntroduction = true;
        } else  {
            // this.noMetamask = false;
            this.loading = false;
        }
    }

    public selectionChange(event:StepperSelectionEvent) {
        if(event.selectedIndex > 0 )
        this.stepper.selectedIndex = 0;
      
    }


    public reset() {
        if (this.dataImporter)
            this.dataImporter.reset();
        if(this.dropConfig)
            this.dropConfig.reset();
        if(this.tokenInfo)
            this.tokenInfo.reset();

        this.context.reset();
    }

}
