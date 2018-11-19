import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { GlobalContextService } from '../../../services/globalContext.service';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'dropPackage',
  templateUrl: './dropPackage.component.html',
  styleUrls: ['./dropPackage.component.css']
})
export class DropPackageComponent implements OnInit {

  public environemntLocal = environment;
  @Output() resetClick: EventEmitter<any> = new EventEmitter<any>(); //creating an output event

  constructor(
    public context: GlobalContextService) { }

  ngOnInit() {
   
  }

  public reset() {
    this.resetClick.emit(null);
  }

}
