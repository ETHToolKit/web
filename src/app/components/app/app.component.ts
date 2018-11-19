import { Component } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { EthereumService } from 'src/app/services/ethereum.service';
import { ServiceEvent } from 'src/app/models/serviceEvent';

declare let location: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public networkDescription:string;

  constructor(public app: FirebaseApp,
    private _ethereumService: EthereumService) {
    this._ethereumService.OnStateChanged().subscribe((result) => this.handleStateChanged(result));
  }

  public handleStateChanged(data) {
    if (data.event == ServiceEvent.Idle) {
        //this.loadingEth = true;
    }
    else if (data.event == ServiceEvent.AccountChanged) {
      if(data.lastAccount != "" && data.lastAccount != data.newAccount)
        location.reload();
    }
    else if (data.event == ServiceEvent.AccountNotFound) {
       
    }
    else if (data.event == ServiceEvent.MetamaskNotDetected) {
      this.networkDescription = "No metamask installed."
    }
    else if (data.event == ServiceEvent.MetamaskDetectedWrongNetwork) {
        this.networkDescription = "Current network not supported."
    }
    else if (data.event == ServiceEvent.MetamaskDetected) {
      
      this.networkDescription = "Network : " + this._ethereumService.getNetwork();
      
    } else if (data.event == ServiceEvent.MetamaskDetectedWrongNetwork) {
       
    }
}

 
}
