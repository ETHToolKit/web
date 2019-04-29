import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild,  CanLoad, Route } from '@angular/router';
import { EthereumService } from './ethereum.service';



@Injectable()
export class NetworkGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private ethereumService: EthereumService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let url: string = state.url;
        var networkReady = this.checkNetwork(url);
        if(!networkReady) {
            this.router.navigate(['/'], {});
        }
        
        return networkReady;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {

        let url = `/${route.path}`;
        return this.checkNetwork(url);
    }

    checkNetwork(url: string): boolean {
        return this.ethereumService.isReady;
    }
}