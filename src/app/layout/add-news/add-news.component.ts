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
    selector: "app-add-news",
    templateUrl: "./add-news.component.html",
    styleUrls: ["./add-news.component.scss"],
    providers: [
        { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
        NgbDatepickerConfig,
    ],
})
export class AddNewsComponent implements OnInit {
    token: any;
    data: any = {};
    news: any = {};
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
            this.data = { newsId: routeParams.id };
            this.getNewsById(this.data);
        }
        document
            .getElementById("news-link")
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
            .getElementById("news-link")
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
                    this.news.imageUrl = serverResponce;
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
    S3upload(news) {
        const promise = new Promise((resolve, reject) => {
            let newsDataContent = { contentType: news.type, type: "NEWS" };
            // this.spinner.show();
            this.service.getSignedUrl(this.token, newsDataContent).then(
                (res) => {
                    let serverResponce: any = res;
                    this.signedURL = serverResponce.data.signedURL;
                    this.service.S3upload(this.signedURL, news).then(
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

    // Method to validate news
    validateNews() {
        if (this.news.title == undefined || this.news.title == "") {
            this.toastr.error("Please provide title");
            return false;
        }

        if (this.trimWhiteSpace(this.news.title)) {
            this.toastr.error("Please provide title");
            return false;
        }

        if (this.news.newsDate == undefined || this.news.newsDate == "") {
            this.toastr.error("Please provide news date");
            return false;
        }

        if (this.news.description == undefined || this.news.description == "") {
            this.toastr.error("Please provide description");
            return false;
        }

        if (
            this.news.description != undefined &&
            this.news.description != "" &&
            this.removeHTMLTag(this.news.description)
        ) {
            this.toastr.error("Please provide description");
            return false;
        }

        if (this.news.imageUrl == undefined || this.news.imageUrl == "") {
            this.toastr.error("Please upload image");
            return false;
        }

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
                this.news.imageUrl = "";
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

    // Method for create and update news
    submit() {
        let isValid = this.validateNews();
        if (isValid) {
            this.news.newsDate = this.GetFormattedDate(this.news.newsDate);
            if (this.news.id) {
                this.spinner.show();
                this.service.updateNews(this.token, this.news).then(
                    (result) => {
                        let serverResponce: any = result;
                        this.spinner.hide();
                        this.router.navigate(["/news"]);
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
                this.service.createNews(this.token, this.news).then(
                    (result) => {
                        let serverResponce: any = result;
                        this.spinner.hide();
                        this.router.navigate(["/news"]);
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

    // Method to get news from Id
    getNewsById(data) {
        this.spinner.show();
        this.service.getNewsById(this.token, data).then(
            (result) => {
                let serverResponce: any = result;
                this.news = serverResponce.data.newsDatails;
                this.news.newsDate = new Date(
                    serverResponce.data.newsDatails.newsDate
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
