import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {ApiService} from '../../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    public success;
    public token;
    public serverError;
    isActive: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';

    constructor(public router: Router, public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService) {

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

    
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
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

    // changeLang(language: string) {
    //     this.translate.use(language);
    // }

    ngOnInit() {
        this.token = localStorage.getItem('auth-token');
    }

    logout(data) {
        this.spinner.show();
        this.service.logout(this.token,data)
            .then((result) => {
                let serverResponce:any = result;
                localStorage.clear();
                this.success = serverResponce.message;
                this.toastr.success(this.success);
                this.router.navigate(['/login']);
                this.spinner.hide();
            }, (error)=>{
                this.spinner.hide();
                this.serverError = error.message;
                this.toastr.error(this.serverError);
            });
    }
}
