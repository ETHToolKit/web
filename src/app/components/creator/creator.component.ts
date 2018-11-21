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
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';




@Component({
    selector: 'creator',
    templateUrl: './creator.component.html'
})
export class CreatorComponent implements OnInit {

    constructor(
        private _ethereumService: EthereumService) {
        this._ethereumService.OnStateChanged().subscribe((result) => this.handleStateChanged(result));
    }

    async ngOnInit() {

    }

    public handleStateChanged(data) {
        if (data.event == ServiceEvent.AccountChanged) {
            this.reset();
        }
    }

    public reset() {
       
    }
}
