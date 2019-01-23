import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _router: Router ) { }

    canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
        localStorage.setItem('currentUrl', window.location.hash);
        console.log( window.location.hash);
        if (localStorage.getItem('authToken')) {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }
}


