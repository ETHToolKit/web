import { interval, BehaviorSubject, Subscription, timer, Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import * as Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { ServiceEvent } from '../models/serviceEvent';

declare let Web3: any;
declare let window: any;
declare let location: any;


@Injectable()
export class EthereumService {

    private networkId: string;
    public web3: any;

    public currentAccount: string = "";

    public accountChanged: BehaviorSubject<any> = new BehaviorSubject("No account detected.");

    private stateChanged: BehaviorSubject<any> = new BehaviorSubject({ event: ServiceEvent.Idle });
    private subUpdateState: Subscription;

    constructor(private _zone: NgZone) {
        this.checkAndInstantiateWeb3();
    }

    public getAccount() {
        return this.currentAccount;
    }

    public getNetwork(): string {
        switch (this.networkId) {
            case "1": return "Mainnet";
            case "4": return "Rinkeby";
            default: return "";
        }
    }

    public isMainnet():boolean {
        return this.networkId == "1";
    }

    private checkAndInstantiateWeb3() {
        //new metamask
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            // Request account access if needed
            this.stateChanged.next({ event: ServiceEvent.WaitingForAcceptance });
            window.ethereum.enable().then(() => {
                this.web3 = window.web3;
                this.networkId = this.web3.version.network;

                console.log("Network ", this.getNetwork());

                if (this.getNetwork().toLowerCase() == 'rinkeby' || this.getNetwork().toLowerCase() == 'mainnet') {
                    this.stateChanged.next({ event: ServiceEvent.MetamaskDetected });
                    this.subUpdateState = timer(400, 1000).subscribe(() => this.updateState());
                } else {
                    this.stateChanged.next({ event: ServiceEvent.MetamaskDetectedWrongNetwork });
                    this.subUpdateState = timer(400, 1000).subscribe(() => this.updateState());
                }

            }).catch(() => {
                this.web3 = null;
                this._zone.run(() => this.stateChanged.next({ event: ServiceEvent.MetamaskNotDetected }));
            });
        }
        else if (typeof window.web3 !== 'undefined') {
            this.web3 = new Web3(window.web3.currentProvider);
            this.networkId = this.web3.version.network;
            this._zone.run(() => {
                console.log("Network ", this.getNetwork());

                if (this.getNetwork().toLowerCase() == 'rinkeby' || this.getNetwork().toLowerCase() == 'mainnet') {
                    this.stateChanged.next({ event: ServiceEvent.MetamaskDetected });
                    this.subUpdateState = timer(400, 1000).subscribe(() => this.updateState());
                } else {
                    this.stateChanged.next({ event: ServiceEvent.MetamaskDetectedWrongNetwork });
                    this.subUpdateState = timer(400, 1000).subscribe(() => this.updateState());
                }

            });
        }
        else {
            this.stateChanged.next({ event: ServiceEvent.MetamaskNotDetected });
            this.subUpdateState = timer(400, 1000).subscribe(() => this.updateState());
        }
    }

    //0 - init
    //1 - metamask locked
    //2 - metamask unlocked
    //3 - metmakask error

    private internalState = 0;
    private refreshAccounts = () => {
        if (this.web3) {

            if (this.web3.version.network != this.networkId && this.networkId != undefined)
                location.reload();
            //this.networkId = this.web3.version.network;

            this.web3.eth.getAccounts((err: any, accs: any) => {
                if (err != null && this.internalState != 3) {
                    this.internalState = 3;
                    this._zone.run(() => {
                        this.currentAccount = "";
                        this.stateChanged.next({ event: ServiceEvent.AccountNotFound })
                    });
                }
                else if (accs.length == 0 && this.internalState != 1) {
                    this.internalState = 1;
                    this._zone.run(() => {
                        this.currentAccount = "";
                        this.stateChanged.next({ event: ServiceEvent.AccountNotFound })
                    });
                }
                else if (accs.length > 0 && this.currentAccount !== accs[0]) {
                    this.internalState = 2;
                    this._zone.run(() => this.handleAccountChanged(accs));
                }
            });
        }
    }

    private updateState() {
        this.refreshAccounts();
    }

    private handleAccountChanged(accs: any) {
        let lastAccount = this.currentAccount;
        this.currentAccount = accs[0];

        this.stateChanged.next({ event: ServiceEvent.AccountChanged, lastAccount: lastAccount, newAccount: this.currentAccount });
    }

    public OnStateChanged = (): Observable<any> => {
        return this.stateChanged.asObservable();
    }

    ngOnDestroy = () => {
        this.subUpdateState.unsubscribe();
    }

    public normalize(value: BigNumber, decimals: number): BigNumber {
        var returnValue = value.dividedBy(new BigNumber(10).pow(decimals));
        return returnValue;

    }
}