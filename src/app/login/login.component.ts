import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import {ApiService} from '../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(public router: Router, public service: ApiService,private toastr: ToastrService,private spinner: NgxSpinnerService) {
    }
     public user = {username :'',password:'',accountType : 'ADMIN'};
     public serverError;


    ngOnInit() { }

    login(user) {
        // if ((user.username !== undefined || user.username !== '') && (user.password !== undefined || user.password !== '')) {
            this.spinner.show();
            this.service.login(user)
                .then((result) => {
                        let serverResponce:any = result;                        
                        // let at = '';
                        // if(serverResponce.authToken) { at = serverResponce.authToken};
                        localStorage.setItem('auth-token',serverResponce.authToken );
                        // localStorage.setItem('username', serverResponce.username);
                        // localStorage.setItem('userID', serverResponce.id);
                        this.router.navigate(['/dashboard']);
                        this.spinner.hide();
                }, (error)=>{
                    this.spinner.hide();
                    if(error.error.status == 401 || error.error.status == 404){
                        this.serverError = error.error.message;;    
                    }else{
                        this.serverError = "Server not responding.Please try again later.";
                    }
                    this.toastr.error(this.serverError);
                });
        // }
    }

}
