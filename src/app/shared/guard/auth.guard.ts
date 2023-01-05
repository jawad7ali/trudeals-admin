import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private httpClient: HttpClient) {}

    canActivate() {
        if (localStorage.getItem('auth-token')) {
            return true;
        }

            this.router.navigate(['/login']);
            return false;


    }
}
