import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {routerTransition} from "../../../router.animations";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ApiService} from "../../../api.service";
import {Router} from "@angular/router";


@Component({
    selector: 'app-add-video',
    templateUrl: './add-video.component.html',
    styleUrls: ['./add-video.component.scss'],
    animations: [routerTransition()]
})

export class AddVideoComponent implements OnInit{
    @Input() video: any;
    @Input() place: string;
    @Input() maxPosition: number;
    @Output() onSubmit = new EventEmitter();
    @Output() onChangeOrder = new EventEmitter();
    signedURL:any;
    token: any;
    isLoading: boolean= false;


    constructor( private apiService: ApiService, private modalService: NgbModal, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) {
    }


    ngOnInit() {
        this.token = localStorage.getItem('auth-token');
        if(this.token == null){
            this.router.navigate(['/login']);
        }
    }

    // Method to get signed url
    posterUpload(event){
        const file= event.target.files[0];
        if(file.type != 'image/jpeg' && file.type != 'image/png'){
            this.toastr.error("Please upload .png/.jpeg image only");
        }else{
            this.spinner.show();
            this.S3upload(file, 'poster').then((res:any) => {
                this.video.poster = res;
                this.spinner.hide();
            },err =>{
                this.toastr.error(err.error.message);
                this.spinner.hide();
            })
        }
    }

    videoUpload(event, type) {
        const file = event.target.files[0];
        if (file.size > (1024 * 1024 * 1500)) {
            this.toastr.error("Please upload a file less than 1500MB");
            return;
        }
        let typeData;
        switch (type) {
            case 'src':
            case 'src_webm':
                typeData = 'video';
                break;
            case 'track':
                typeData = 'track';
                break;
        }
        if(typeData === 'video' && file.type.split('/')[0] != 'video'){
            this.toastr.error("Please upload a video only");
        }else{
            this.spinner.show();
            this.S3upload(file, typeData).then((res:any) => {
                this.video[type] = res;
                this.spinner.hide();
            },err =>{
                this.toastr.error(err.error.message);
                this.spinner.hide();
            })
        }
    }


    // Method to upload image in S3 Bucket
    S3upload(media, type){
        const promise = new Promise((resolve, reject) => {
            let mediaDataContent = {contentType : media.type,type:type};
            // this.spinner.show();
            this.apiService.getSignedUrl(this.token,mediaDataContent)
                .then((res) => {
                    let serverResponce:any = res;
                    this.signedURL = serverResponce.data.signedURL;
                    this.apiService.S3upload(this.signedURL,media)
                        .then((res) => {
                            resolve(serverResponce.data.imageUrl);
                        }, (error)=>{
                            // this.spinner.hide();
                            this.toastr.error(error.error.message);
                            reject();
                        });
                }, (error)=>{
                    // this.spinner.hide();
                    this.toastr.error(error.error.message);
                    reject();
                });
        });
        return promise;
    }


    trimWhiteSpace(value){
        let trim = value.trim()
        if(trim == ''){
            return true;
        }else{
            return false;
        }
    }


    // Method to validate media
    validateMedia(){
        if(this.video.src == undefined || this.video.src == ''){
            this.toastr.error("Please upload a main video file");
            return false;
        }

        /*if(this.video.poster == undefined || this.video.poster == ''){
            this.toastr.error("Please upload a poster image");
            return false;
        }*/

        if(this.video.title == undefined || this.video.title == ''){
            this.toastr.error("Please provide title");
            return false;
        }

        if(this.trimWhiteSpace(this.video.title)){
            this.toastr.error("Please provide title");
            return false;
        }

        return true;

    }


    // Method to update media
    submit(place){
        let isValid = this.validateMedia();
        if(isValid){
            this.spinner.show();
            const method = place === 'modal'? 'updateVideo' : 'createVideo';
            this.apiService[method](this.token,this.video)
                .then((result:any) => {
                    this.toastr.success(result.message);
                    this.spinner.hide();
                    this.onSubmit.emit({...result.data, place: place});
                }, (error)=>{
                    this.spinner.hide();
                    if(error.status == 404 || error.status == 409){
                        this.toastr.error(error.error.message);
                    }else{
                        this.toastr.error("Server not responding.Please try again later.");
                    }

                });
        }

    }

    changeOrder(type) {
        this.isLoading = true;
        this.apiService.changeVideoPosition(this.token, {id:this.video.id, position: this.video.position, type: type})
            .then((result:any)=>{
                this.video.position = result.data.position;
                this.isLoading = false;
                this.onChangeOrder.emit({videoData: this.video, type:type});
            }, error => {
                this.isLoading = false;
                this.toastr.error(error.error.message);
            });
    }

}
