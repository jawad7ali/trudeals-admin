import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {Router} from '@angular/router';
import {ApiService} from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-Changepassword',
    templateUrl: './Changepassword.component.html',
    styleUrls: ['./Changepassword.component.scss'],
    animations: [routerTransition()]
})
export class ChangePasswordComponent implements OnInit {

    public userId;
    public token;
    public serverError;
    public user:any;
    public data;
    public success;

    constructor(public router: Router, public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService) {
    }

    ngOnInit() {
        this.token = localStorage.getItem('auth-token');
        if(this.token == null){
            this.router.navigate(['/login']);
        }
        this.userId = localStorage.getItem('userID');
    }

    changePassword(user){
        user.newPassword = user.oldPassword.trim();
        if(user.newPassword == ""){
            // this.toasterService.pop('error', 'Error', "Please enter password without space");
        }else{
            this.data = {userId: this.userId, oldPassword : user.oldPassword, newPassword : user.newPassword};
            this.spinner.show();
            this.service.changePassword(this.token,this.data)
            .then((result) => {
                let serverResponce:any = result;
                localStorage.setItem('auth-token', serverResponce.response.authToken);
                this.success = serverResponce.response.message;
                // this.toasterService.pop('success', 'Success', this.success);
                this.router.navigate(['/dashboard']);
                this.spinner.hide();
                }, (error)=>{
                    this.spinner.hide();
                    this.serverError = error.response.message;
                    // this.toasterService.pop('error', 'Error', this.serverError);
                });
        }

    }

}
