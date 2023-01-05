import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

@Injectable()
export class ApiHttp {
    constructor(private http: HttpClient, public router: Router) {}

    post(apiURL, data, headers, result, error, success) {
        return this.http
            .post(apiURL, JSON.stringify(data), headers)
            .toPromise()
            .then(
                (res) => {
                    // Success
                    let serverResponce: any = res;
                    if (serverResponce.status == 200) {
                        success = serverResponce;
                        result(success);
                    } else {
                        // this.error = res.message;
                        error(serverResponce);
                    }
                },
                (msg) => {
                    // Error
                    this.errorHandler(error, msg);
                }
            );
    }

    get(apiURL, options, result, error, success) {
        return this.http
            .get(apiURL, { ...options, observe: "response" })
            .toPromise()
            .then((response) => {
                let serverResponce: any = response;
                if (serverResponce.status == 200) {
                    success = serverResponce.body;
                    result(success);
                } else {
                    // this.error = res.message;
                    error(serverResponce);
                }
            })
            .catch((message) => {
                this.errorHandler(error, message);
            });
    }

    put(apiURL, data, headers, result, error, success) {
        return this.http
            .put(apiURL, JSON.stringify(data), { headers, observe: "response" })
            .toPromise()
            .then(
                (res) => {
                    // Success
                    let serverResponce: any = res;
                    if (serverResponce.status == 200) {
                        success = serverResponce;
                        result(success);
                    } else {
                        // this.error = res.message;
                        error(serverResponce);
                    }
                },
                (msg) => {
                    // Error
                    this.errorHandler(error, msg);
                }
            );
    }

    delete(apiURL, headers, result, error, success) {
        return this.http
            .delete(apiURL, { headers, observe: "response" })
            .toPromise()
            .then(
                (res) => {
                    // Success
                    let serverResponce: any = res;
                    if (serverResponce.status == 200) {
                        success = serverResponce;
                        result(success);
                    } else {
                        // this.error = res.message;
                        error(serverResponce);
                    }
                },
                (msg) => {
                    // Error
                    this.errorHandler(error, msg);
                }
            );
    }

    errorHandler(error, msg) {
        if (msg) {
            if (msg.error) {
                error(msg.error);
                if (msg.error.error) {
                    if (msg.error.error.statusCode == 401) {
                        localStorage.removeItem("auth-token");
                        this.router.navigate(["/login"]);
                    }
                }
            } else {
                error(msg);
            }
        }
    }
}
