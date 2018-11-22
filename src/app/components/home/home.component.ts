import { Component } from '@angular/core';
import { EthereumService } from 'src/app/services/ethereum.service';
import { ServiceEvent } from 'src/app/models/serviceEvent';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isReady: boolean = false;
  showToken:boolean = true;

  constructor(private _ethereumService: EthereumService) {
    this._ethereumService.OnStateChanged().subscribe((result) => this.handleStateChanged(result));
  }

  public handleStateChanged(data) {
    this.isReady = data.isReady;
    this.showToken = this._ethereumService.getNetwork() == "Rinkeby";
    
  }
}
