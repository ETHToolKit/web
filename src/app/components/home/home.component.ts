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
  networkNotSupported = false;

  constructor(private _ethereumService: EthereumService) {
    this._ethereumService.OnStateChanged().subscribe((result) => this.handleStateChanged(result));
  }

  public handleStateChanged(data) {
    if (data.event == ServiceEvent.AccountChanged) {
      if (data.isReady && this._ethereumService.isSupportedNetwork())
        this.isReady = true;
      else
        this.isReady = false;

    }

  }
}
