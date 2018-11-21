import { Component, OnInit, ViewChild } from '@angular/core';
import { EthereumService } from '../../services/ethereum.service';

import { DropperContextService } from '../../services/dropperContext.service';
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

    @ViewChild(DataImporterComponent) dataImporter: DataImporterComponent;
    @ViewChild(TokenInfoComponent) tokenInfo: TokenInfoComponent;
    @ViewChild(DropConfigComponent) dropConfig: DropConfigComponent;
    @ViewChild(DropPackageComponent) dropPackage: DropPackageComponent;
    @ViewChild(MatStepper) stepper: MatStepper;

    constructor(
        public context: DropperContextService,
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

    public selectionChange(event: StepperSelectionEvent) {
        if (event.selectedIndex > 0)
            this.stepper.selectedIndex = 0;
    }


    public reset() {
        if (this.dataImporter)
            this.dataImporter.reset();
        if (this.dropConfig)
            this.dropConfig.reset();
        if (this.tokenInfo)
            this.tokenInfo.reset();

        this.context.reset();
    }

}
