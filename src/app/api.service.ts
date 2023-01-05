import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { Router } from "@angular/router";
import { ApiHttp } from "./api.http";
import * as _ from "lodash";
import { PageBlock, RESTFilter, RESTParams } from "./Interfaces/interfaces";
import {environment} from '../environments/environment';

@Injectable()
export class ApiService {
    url = environment.url;
    success;
    error;
    token: string;
    headers: HttpHeaders;

    constructor(
        private http: HttpClient,
        public router: Router,
        private apiHttp: ApiHttp
    ) {}

    getToken() {
        this.token = localStorage.getItem("auth-token");
    }

    setHeaders() {
        this.getToken();
        this.headers = new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: this.token,
        });
    }

    // Login
    login(data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/admin-login`;
            this.http
                .post(apiURL, data)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status === 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                    }
                );
        });
        return promise;
    }

    // Method to get signed URL
    getSignedUrl(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Categories/generate-signed-url`;
            this.http
                .get(apiURL, {
                    headers: {
                        authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Method to upload image in S3 bucket
    S3upload(URL, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${URL}`;
            let headers = {
                headers: new HttpHeaders({ "Content-Type": data.type }),
            };
            return this.http
                .put(apiURL, data, headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        this.success = "200";
                        result(this.success);
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Media
    createMedia(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/GalleryImages/image`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getMediaList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/GalleryImages/admin`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);

                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    updateMedia(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/GalleryImages/image`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    deleteMedia(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/GalleryImages/image`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // category
    getCategoryCount(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Categories/get-category/count`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    createCategory(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Categories/add-category`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getCategoryList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Categories/admin`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    activeDeactiveCategory(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Categories/category`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getCategoryById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Categories/get-category-details`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    updateCategory(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Categories/update-category`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Location
    getLocationCount(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Locations/get-location/count`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getLocationList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Locations/admin`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    activeDeactiveLocation(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Locations/location`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    createLocation(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Locations/add-location`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    updateLocation(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Locations/update-location`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getLocationById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Locations/get-location-details`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // if(msg.error.error.statusCode == 401){
                        //     localStorage.removeItem('auth-token');
                        //     this.router.navigate(['/login']);
                        // }
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // News
    getNewsCount(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/News/news/count`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }
	
	getPagesCount(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Pages/pages/count`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getNewList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/News/news/admin`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }
	
	getPagesList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Pages/pages/admin`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    activeDeactiveNews(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/News/news/status`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }
	
	activeDeactivePages(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Pages/pages/status`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    deleteNews(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/News/news`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }
	
	deletePages(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Pages/pages`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    createNews(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/News/news`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getNewsById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/News/news/details/admin`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }
	
	getPageById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Pages/pages/details/admin`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    updateNews(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/News/news`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }
	
	updatePage(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Pages/pages`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // User Management
    getUsersCount(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/user/count`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getUsersList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/admin/member`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    activeDeactiveUser(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/member`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Method to know if username is availabel
    searchUsername(data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/user-availability`;
            this.http
                .post(apiURL, data)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status === 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }
    createAdmin(token, data){
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/admin`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;

    }

    createUser(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/business`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getUserById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/business`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }
    updateAdmin(token, data){
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/admin`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;  
    }

    updateUser(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/business`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    applyPromoCode(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/PromoCodes/apply-promocode`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Member Ship
    getMemberShipList(token) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Memberships/membership`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getMemberShipById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Memberships/membership/details`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    updateMemberShip(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Memberships/membership`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Business Management
    getBusinessCount(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Businesses/business/count`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getBusinessList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Businesses/admin/list`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Get business owner list
    getOwnerList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/admin/business`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Get business category list
    getBusinessCategoryList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Categories/web`;
            this.http
                .get(apiURL, {
                    // headers: {
                    //     'Authorization': token
                    // },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Get location list
    getBusinessLocationList(token) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Locations/web`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Get city list
    getCityList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Locations/get-sub-location`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Method to get gallery image
    getImageList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/GalleryImages/web`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    createOrUpdateBusiness(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Businesses/admin/business`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Method to update business location
    updateBusinessLocation(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Businesses/location`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Get business details
    getBusinessById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Businesses/get-business`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Deals
    getDealsCount(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Deals/deals/count`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getDealsList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Deals/admin/list`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    activeDeactiveDeal(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Deals/deal/status`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    createDeal(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Deals/admin/deal`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Get business list
    getBusinessDealList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Businesses/business/listing`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getDealById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Deals/vendor/deal`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    updateDeal(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Deals/admin/deal`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    deleteDeal(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Deals/deal`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // FAQ
    getFaqList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/FAQs/faq`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // console.log(msg,'msg');
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    createOrUpdateFAQ(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/FAQs/faq`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    deleteFaq(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/FAQs/faq`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Banner
    createBanner(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Banners/banner`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getBannerList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Banners/admin`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        // console.log(msg.error,'msg.error');
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    activeDeactiveBanner(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Banners/banner/status`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    deleteBanner(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Banners/banner`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getBannerById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Banners/banner`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    updateBanner(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Banners/banner`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // QnA
    updateQnA(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/QAs/qa`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getQnADetails(token) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/QAs/qa`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Video
    getVideoDetails(token, data = {}) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Videos/video`;
            this.apiHttp.get(
                apiURL,
                { headers: { Authorization: token }, params: data },
                result,
                error,
                this.success
            );
        });
        return promise;
    }

    createVideo(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Videos/video`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.apiHttp.post(
                apiURL,
                data,
                headers,
                result,
                error,
                this.success
            );
        });
        return promise;
    }

    updateVideo(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Videos/video`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.apiHttp.put(
                apiURL,
                data,
                headers,
                result,
                error,
                this.success
            );
        });
        return promise;
    }

    deleteVideo(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Videos/video/${data.id.toString()}`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => { error(msg);}
                );
        });
        return promise;
    }

    changeVideoPosition(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Videos/video/change-position`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            this.apiHttp.put(
                apiURL,
                data,
                headers,
                result,
                error,
                this.success
            );
        });
        return promise;
    }

    // Create/update subscription
    createSubscription(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/update-membership-details`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                    }
                );
        });
        return promise;
    }

    // Dashboard
    getDashboardCount(token) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/Members/admin/dashboard`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Promo Code
    getPromoCodeCount(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/PromoCodes/promocode/count`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getPromoCodeList(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/PromoCodes/promocode/admin`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    createPromoCode(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/PromoCodes/promocode`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    activeDeactivePromoCode(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/PromoCodes/promocode/status`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    deletePromoCode(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/PromoCodes/promocode`;
            this.http
                .delete(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    getPromoCodeById(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/PromoCodes/promocode-details`;
            this.http
                .get(apiURL, {
                    headers: {
                        Authorization: token,
                    },
                    params: data,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    updatePromoCode(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/PromoCodes/promocode`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .put(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Forget password
    forgetPassword(user) {
        return new Promise((result, error) => {
            // let apiURL = `${this.url}/admin/forgetpassword`;
            let apiURL = `${this.url}/forgotpassword`;
            this.http
                .post(apiURL, {
                    email: user.email,
                    accountType: user.accountType,
                })
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status === 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                    }
                );
        });
    }

    //Logout service
    logout(token, data) {
        return new Promise((result, error) => {
            let apiURL = `${this.url}/logout`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, data, headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.status == 200) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
    }

    // Change password
    changePassword(token, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/api/adminMembers/changepassword`;
            let headers = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: token,
                }),
            };
            return this.http
                .post(apiURL, JSON.stringify(data), headers)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                        if (serverResponce.response.status === 1) {
                            this.success = serverResponce;
                            result(this.success);
                        } else {
                            // this.error = res.message;
                            error(serverResponce);
                        }
                    },
                    (msg) => {
                        // Error
                        error(msg);
                        if (msg) {
                            if (msg.error) {
                                if (msg.error.error) {
                                    if (msg.error.error.statusCode == 401) {
                                        localStorage.removeItem("auth-token");
                                        this.router.navigate(["/login"]);
                                    }
                                }
                            }
                        }
                    }
                );
        });
        return promise;
    }

    // Update madndotary image
    updateImageMan(token, Id, data) {
        const promise = new Promise((result, error) => {
            let apiURL = `${this.url}/admin/upload-image`;
            // let headers =  {headers: new  HttpHeaders({'Content-Type': undefined,'Authorization' : token })};
            return this.http
                .post(apiURL, Id, data)
                .toPromise()
                .then(
                    (res) => {
                        // Success
                        let serverResponce: any = res;
                    },
                    (msg) => {
                        // Error
                        error(msg);
                    }
                );
        });
        return promise;
    }

    getPageBlocksCount(params: RESTFilter = {}) {
        this.setHeaders();
        let httpParams:any =''
        if(params.where.or.text || params.where.or.title || params.where.or.url){
        console.log(params.where.or.title,'params.where')
            httpParams = new HttpParams({
                fromString: "where=" + JSON.stringify(params.where),
            });
        }
        const apiURL = `${this.url}/api/pageblocks/count`;
        const headers = this.headers;
        return new Promise((result, error) => {
            this.apiHttp.get(
                apiURL,
                { params: httpParams, headers },
                result,
                error,
                this.success
            );
        });
    }

    getPageBlockList(params: RESTParams = {}) {
        this.setHeaders();
        const apiURL = `${this.url}/api/pageblocks`;
        const headers = this.headers;
        let httpParams:any = ''
        if(params.filter.where.or.text || params.filter.where.or.title || params.filter.where.or.url){
            console.log(params.filter.where.or.title,'params.where')
            httpParams = new HttpParams({
                fromString: "filter=" + JSON.stringify(params.filter),
            });
        }
        return new Promise((result, error) => {
            this.apiHttp.get(
                apiURL,
                { params: httpParams, headers },
                result,
                error,
                this.success
            );
        });
    }

    putPageBlock(data: PageBlock) {
        this.setHeaders();
        const apiURL = `${this.url}/api/pageblocks`;
        const headers = this.headers;
        return new Promise((result, error) => {
            this.apiHttp.put(
                apiURL,
                { ...data },
                headers,
                result,
                error,
                this.success
            );
        });
    }

    deletePageBlock(data: PageBlock) {
        this.setHeaders();
        const apiURL = `${this.url}/api/pageblocks/` + data.id;
        const headers = this.headers;
        return new Promise((result, error) => {
            this.apiHttp.delete(apiURL, headers, result, error, this.success);
        });
    }

    errorHandler() {}
}
