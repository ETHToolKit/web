import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { DropperContextService } from '../../../services/dropperContext.service';
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
    public context: DropperContextService) { }

  ngOnInit() {
   
  }

  public reset() {
    this.resetClick.emit(null);
  }

}
