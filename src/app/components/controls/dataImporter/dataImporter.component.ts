import { Component, OnInit, ViewChild, ElementRef, Host, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatStep } from '@angular/material';
import { DropperContextService } from '../../../services/dropperContext.service';
import { AirdropItem } from '../../../models/airdropItem.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContextWorkerService } from 'src/app/services/contextWorker.service';


@Component({
    selector: 'dataImporter',
    templateUrl: './dataImporter.component.html',
    styleUrls: ['./dataImporter.component.css']
})
export class DataImporterComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild('fileInput') fileInputRef: ElementRef;

    @Input() public step: MatStep;

    displayedColumns: string[] = ['id', 'account', 'balance', 'balanceRaw'];
    dataSource = new MatTableDataSource<AirdropItem>();

    public importMethod: string = 'file';
    public pastedText: string = null;
    public fileName: string;

    secondFormGroup: FormGroup;

    public errorMessage:string;

    constructor(
        private _formBuilder: FormBuilder,

        private worker: ContextWorkerService,
        public context: DropperContextService) { }

    ngOnInit() {
        this.secondFormGroup = this._formBuilder.group({
            //secondCtrl: ['', Validators.required]
        });
    }

    public onFileChange(event: any) {

        if (event.target.files && event.target.files.length > 0) {
            let reader = new FileReader();
            reader.onload = async () => {
                await this.parseData(reader.result);
            };

            let file = event.target.files[0];
            this.fileName = event.target.files[0].name;
            reader.readAsText(file);
        }
    }

    public onTextPasted(event: any) {
        this.parseData(event.target.value);
    }

    private async parseData(data: any) {
        try {
            this.errorMessage = null;

            await this.worker.parseData(data)

            this.dataSource = new MatTableDataSource<AirdropItem>(this.context.airdrop.airdropData.items);
            this.dataSource.paginator = this.paginator;
            this.step.completed = true;

        }
        catch (e) {
            this.errorMessage = e;
            this.dataSource = new MatTableDataSource<AirdropItem>();
            
        }
    }

    public reset() {

        this.dataSource = null;
        this.importMethod = 'file';
        this.pastedText = null;
        this.fileName = null;
        this.step.completed = false;
        this.errorMessage = null;

        if (this.fileInputRef)
            this.fileInputRef.nativeElement.value = "";

    }

}
