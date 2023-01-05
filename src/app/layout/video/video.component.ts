import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../api.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddVideoComponent} from "./add-video/add-video.component";
import {copyObj} from "@angular/animations/browser/src/util";
import swal from "sweetalert2";
import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit,OnDestroy {

    @ViewChild(AddVideoComponent)

    token:any;
    videoList: any = [];
    video: any;
    signedURL:any;
    isValidModal:boolean = false;
    modalOpen:boolean = true;
    isOpenAddNewVideo:boolean = false;
    newVideo: any = {
        title: '',
        src: '',
        src_webm: '',
        poster: '',
        position: '',
    };
    maxPosition: number;
    formNewVideo = {...this.newVideo};

    constructor(private modalService: NgbModal, private apiService: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) {
    }

    ngOnInit() {
        this.token = localStorage.getItem('auth-token');
        if(this.token == null){
            this.router.navigate(['/login']);
        }
        this.getVideoList();
        document.getElementById("video-link").classList.add('router-link-active');
    }

    ngOnDestroy() {
        document.getElementById("video-link").classList.remove('router-link-active');
    }

    getVideoList(){
        this.spinner.show();
        this.apiService.getVideoDetails(this.token /*{limit: 3}*/)
            .then((result:any) => {

                this.videoList = result.data.videos;
                this.maxPosition = result.data.maxPosition;
                this.formNewVideo.position = this.maxPosition + 1;

                this.spinner.hide();
            }, (error)=>{
                this.spinner.hide();
                this.toastr.error("Server not responding.Please try again later.");
            });
    }

    // Method for model
    open(content, video) {
        this.video = video;
        this.modalService.open(content, { size: 'lg',backdrop:false}).result.then((result) => {
            this.modalOpen = true;
        }, (reason) => {
        });
    }


    toggle() {
        this.isOpenAddNewVideo = !this.isOpenAddNewVideo;
    }

    onSubmit(result){
        this.getVideoList();
        if (result.place === 'newVideo') {
            this.toggle();
            this.formNewVideo = {...this.newVideo};
        } else if (result.place === 'modal') {
            $( ".close" ).trigger( "click" );
            this.modalOpen = false;
        }
    }

    onChangeOrder(data){
        const {videoData, type} = data;
        const newVideoList = [];
        _.forEach(this.videoList, (videoItem) => {
            if (videoItem.id == videoData.id) {
                newVideoList.push(videoData);
            }
            else if (videoItem.position == videoData.position) {
                newVideoList.push({...videoItem, position: type == 'increase'? videoItem.position - 1 : videoItem.position + 1});
            }
            else {
                newVideoList.push(videoItem);
            }
        });

        this.videoList = _.sortBy(newVideoList, ['position'], ['asc']);
    }

    // Method to delete media
    deleteVideo(video){
        swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this video',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.spinner.show();
                let deleteData = {id:video.id};
                this.token = localStorage.getItem('auth-token');
                if(this.token == null){
                    this.router.navigate(['/login']);
                }
                this.apiService.deleteVideo(this.token,deleteData)
                    .then((result) => {
                        let serverResponce:any = result;
                        this.toastr.success(serverResponce.message);
                        this.spinner.hide();
                        this.getVideoList();

                        swal(
                            'Success',
                            '',
                            'success'
                        )
                        // this.toasterService.pop('success', 'success', serverResponce.message);
                    }, (error)=>{
                        this.spinner.hide();
                        if(error.error.status == 403){
                            this.toastr.error(error.error.message);
                        }else{
                            this.toastr.error("Server not responding.Please try again later.");
                        }

                    });

            } else if (result.dismiss === swal.DismissReason.cancel) {
                swal(
                    'Cancelled',
                    '',
                    'error'
                )
            }
        })
    }

}
