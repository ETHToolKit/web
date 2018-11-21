import { Component } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { EthereumService } from 'src/app/services/ethereum.service';
import { ServiceEvent } from 'src/app/models/serviceEvent';
import { DropperContextService } from 'src/app/services/dropperContext.service';
import { environment } from '../../../environments/environment';
import { Dropper } from '../../core/contracts/dropper';

declare let location: any;
declare let require: any;

const abi: any = require('../../../assets/TokenDropper.json');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    public networkDescription: string;
    public issueText: string;
    public isReady: number = 0;

    noMetamask: boolean = false;
    noAccount: boolean = true;
    notSupportedNetwork: boolean = false;

    constructor(public app: FirebaseApp,
        public context: DropperContextService,
        private _ethereumService: EthereumService) {
        this._ethereumService.OnStateChanged().subscribe((result) => this.handleStateChanged(result));
    }

    public handleStateChanged(data) {
        if (data.event == ServiceEvent.Idle) {
            //this.loadingEth = true;
        }
        else if (data.event == ServiceEvent.WaitingForAcceptance) {
            this.isReady = 1;
            this.issueText = "Waiting for connection to Metamask";
        }
        else if (data.event == ServiceEvent.AccountChanged ) {
            if (data.lastAccount != "" && data.lastAccount != data.newAccount)
                location.reload();
            if(!this.notSupportedNetwork) {
                this.isReady = 2;
                this.noAccount = false;
                this.noMetamask = false;
                this.issueText = null;
            }
        }
        else if (data.event == ServiceEvent.AccountNotFound) {
            this.isReady = 1;
            this.noAccount = true;
            this.issueText = "Please unlock Metamask account";
        }
        else if (data.event == ServiceEvent.MetamaskNotDetected) {
            this.networkDescription = "No metamask installed."
            this.issueText = "Please install Metamask";
            this.isReady = 1;
            this.noMetamask = true;
        }
        else if (data.event == ServiceEvent.MetamaskDetectedWrongNetwork) {
            this.networkDescription = "Current network not supported."
            this.issueText = "Current network not supported";
            this.isReady = 1;
            this.notSupportedNetwork = true;
        }
        else if (data.event == ServiceEvent.MetamaskDetected) {
            this.noMetamask = false;
            if (this._ethereumService.getNetwork().toLowerCase() == "rinkeby")
                this.context.dropper = new Dropper(environment.dropperAddress, this._ethereumService, abi);
            else
                this.context.dropper = new Dropper(environment.dropperAddressMainnet, this._ethereumService, abi);

            this.networkDescription = "Network : " + this._ethereumService.getNetwork();

        } else {
        }
    }


}
