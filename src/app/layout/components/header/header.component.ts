import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {ApiService} from '../../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
declare var $: any


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';
    public success;
    public token;
    public serverError;
    username;

    constructor(private translate: TranslateService, public router: Router, public service: ApiService,  private toastr: ToastrService,private spinner: NgxSpinnerService) {

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.token = localStorage.getItem('auth-token');        
        this.username = localStorage.getItem('username');
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }
    
    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }
    
    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    logout(data) {
        // localStorage.clear();
        // this.router.navigate(['/login']);
        this.spinner.show();
        this.service.logout(this.token,data)
            .then((result) => {
                let serverResponce:any = result;
                localStorage.removeItem('auth-token');
                this.router.navigate(['/login']);
                this.success = serverResponce.message;
                this.toastr.success(this.success);
                this.spinner.hide();
            }, (error)=>{
                this.spinner.hide();
                this.serverError = error.message;
                this.toastr.error(this.serverError);
            });
    }

    // changeLang(language: string) {
    //     this.translate.use(language);
    // }
}
