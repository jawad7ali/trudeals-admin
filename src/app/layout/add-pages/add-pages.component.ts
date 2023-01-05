import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../router.animations";
import { ApiService } from "../../api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import {
    NgbDateAdapter,
    NgbDateNativeAdapter,
    NgbDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { ckEditorConfig } from "../../constant";

@Component({
    selector: "app-add-pages",
    templateUrl: "./add-pages.component.html",
    styleUrls: ["./add-pages.component.scss"],
    providers: [
        { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
        NgbDatepickerConfig,
    ],
})
export class AddPagesComponent implements OnInit {
    token: any;
    data: any = {};
    pages: any = {};
    signedURL: any;
    ckEditorConfig: any = {};
    datePickerConfig: any;

    constructor(
        public service: ApiService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        public router: Router,
        private activeRoute: ActivatedRoute,
        config: NgbDatepickerConfig
    ) {
        this.datePickerConfig = config;
        this.ckEditorConfig = ckEditorConfig;
    }

    ngOnInit() {
        this.token = localStorage.getItem("auth-token");
        if (this.token == null) {
            this.router.navigate(["/login"]);
        }
        let routeParams = this.activeRoute.snapshot.params;
        if (routeParams.id != "" && routeParams.id != "add") {
            this.data = { pagesId: routeParams.id };
            this.getPageById(this.data);
        }
        document
            .getElementById("pages-link")
            .classList.add("router-link-active");
        const currentDate = new Date();
        // config.minDate = {year:currentDate.getFullYear(), month:currentDate.getMonth()+1, day: currentDate.getDate()};
        this.datePickerConfig.maxDate = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
            day: currentDate.getDate(),
        };
        this.datePickerConfig.outsideDays = "hidden";
    }

    ngOnDestroy() {
        document
            .getElementById("pages-link")
            .classList.remove("router-link-active");
    }

    // Method to get signed url
    imageUpload(event) {
        // console.log(event.target.files[0].type,'event.target.files[0].type');

        if (
            event.target.files[0].type != "image/jpeg" &&
            event.target.files[0].type != "image/png"
        ) {
            this.toastr.error("Please upload .png/.jpeg image only");
        } else {
            this.spinner.show();
            this.S3upload(event.target.files[0]).then(
                (res) => {
                    let serverResponce: any = res;
                    this.pages.imageUrl = serverResponce;
                    this.spinner.hide();
                },
                (err) => {
                    this.toastr.error(err.error.message);
                    this.spinner.hide();
                }
            );
        }
    }

    // Method to upload image in S3 Bucket
    S3upload(pages) {
        const promise = new Promise((resolve, reject) => {
            let pagesDataContent = { contentType: pages.type, type: "NEWS" };
            // this.spinner.show();
            this.service.getSignedUrl(this.token, pagesDataContent).then(
                (res) => {
                    let serverResponce: any = res;
                    this.signedURL = serverResponce.data.signedURL;
                    this.service.S3upload(this.signedURL, pages).then(
                        (res) => {
                            resolve(serverResponce.data.imageUrl);
                        },
                        (error) => {
                            // this.spinner.hide();
                            this.toastr.error(error.error.message);
                            reject();
                        }
                    );
                },
                (error) => {
                    // console.log('dsf',error);
                    // this.spinner.hide();
                    this.toastr.error(error.error.message);
                    reject();
                }
            );
        });
        return promise;
    }

    // Method to trim white space
    trimWhiteSpace(value) {
        let trim = value.trim();
        if (trim == "") {
            return true;
        } else {
            return false;
        }
    }

    // Method to remove html tag
    removeHTMLTag(content) {
        var plainText = content.replace(/<[^>]*>/g, "");
        if (this.trimWhiteSpace(plainText)) {
            return true;
        } else {
            return false;
        }
    }

    // Method to validate pages
    validatePage() {
        if (this.pages.title == undefined || this.pages.title == "") {
            this.toastr.error("Please provide title");
            return false;
        }

        if (this.trimWhiteSpace(this.pages.title)) {
            this.toastr.error("Please provide title");
            return false;
        }

        /*if (this.pages.pagesDate == undefined || this.pages.pagesDate == "") {
            this.toastr.error("Please provide pages date");
            return false;
        }*/

        if (this.pages.description == undefined || this.pages.description == "") {
            this.toastr.error("Please provide description");
            return false;
        }

       /* 
	   if (
            this.pages.description != undefined &&
            this.pages.description != "" &&
            this.removeHTMLTag(this.pages.description)
        ) {
            this.toastr.error("Please provide description");
            return false;
        }
		*/

        /* if (this.pages.imageUrl == undefined || this.pages.imageUrl == "") {
            this.toastr.error("Please upload image");
            return false;
        }*/

        return true;
    }

    // Method to delete image
    deleteImage() {
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                this.pages.imageUrl = "";
                swal("Success", "", "success");
            } else if (result.dismiss === swal.DismissReason.cancel) {
                swal("Cancelled", "", "error");
            }
        });
    }

    // Method to get date formate
    GetFormattedDate(d) {
        let date = new Date(d);
        return (
            date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            date.getFullYear()
        );
    }

    // Method for create and update pages
    submit() {
        let isValid = this.validatePage();
        if (isValid) {
            this.pages.pagesDate = this.GetFormattedDate(this.pages.pagesDate);
            if (this.pages.id) {
                this.spinner.show();
                this.service.updatePage(this.token, this.pages).then(
                    (result) => {
                        let serverResponce: any = result;
                        this.spinner.hide();
                        this.router.navigate(["/pages"]);
                        this.toastr.success(serverResponce.message);
                    },
                    (error) => {
                        this.spinner.hide();
                        if (error.status == 400 || error.status == 409) {
                            this.toastr.error(error.error.message);
                        } else {
                            this.toastr.error(
                                "Server not responding.Please try again later."
                            );
                        }
                    }
                );
            } else {
                this.spinner.show();
                this.service.createNews(this.token, this.pages).then(
                    (result) => {
                        let serverResponce: any = result;
                        this.spinner.hide();
                        this.router.navigate(["/pages"]);
                        this.toastr.success(serverResponce.message);
                    },
                    (error) => {
                        this.spinner.hide();
                        if (error.status == 400 || error.status == 409) {
                            this.toastr.error(error.error.message);
                        } else {
                            this.toastr.error(
                                "Server not responding.Please try again later."
                            );
                        }
                    }
                );
            }
        }
    }

    // Method to get pages from Id
    getPageById(data) {
        this.spinner.show();
        this.service.getPageById(this.token, data).then(
            (result) => {
                let serverResponce: any = result;
                this.pages = serverResponce.data.pagesDatails;
                this.pages.pagesDate = new Date(
                    serverResponce.data.pagesDatails.pagesDate
                );
                this.spinner.hide();
            },
            (error) => {
                this.spinner.hide();
                this.toastr.error(
                    "Server not responding.Please try again later."
                );
            }
        );
    }
}
