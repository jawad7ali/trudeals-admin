import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../router.animations";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: "app-forgotPassword",
    templateUrl: "./forgotPassword.component.html",
    styleUrls: ["./forgotPassword.component.scss"],
    animations: [routerTransition()],
})
export class ForgotPassswordComponent implements OnInit {
    public user = { email: "", accountType: "ADMIN" };
    public success;
    public serverError;
    constructor(
        public router: Router,
        public service: ApiService,
        public toasterService: ToastrService,
        public spinner: NgxSpinnerService
    ) {}

    ngOnInit() {}

    forgetPassword(user) {
        this.spinner.show();
        this.service.forgetPassword(user).then(
            (result) => {
                this.spinner.hide();
                let serverResponce: any = result;
                this.success = serverResponce.message;
                this.toasterService.success(this.success);
                this.user.email = "";
            },
            (error) => {
                this.spinner.hide();
                this.serverError = error.message;
                this.toasterService.error("error", "Error", this.serverError);
            }
        );
    }
}
