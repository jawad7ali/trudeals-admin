import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private router: Router ) { }

  // canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   return true;
  // }

    canActivate() {
        if (!(localStorage.getItem('auth-token'))) {
            return true;
        }

        this.router.navigate(['/dashboard']);
        return false;


    }
}
