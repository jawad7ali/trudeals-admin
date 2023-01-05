import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
declare var $: any

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  animations: [routerTransition()]
})
export class MediaComponent implements OnInit {

  // closeResult: string;
  token:any;
  mediaList:any =[];
  media:any={};
  categoryList:any;
  data:any={};
  signedURL:any;
  filter:any;
  delayTimer;
  pageSize:number;
  currentPage:number;
  maxSize:number;
  totalMedia:number;

  constructor(private modalService: NgbModal,public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) {
    this.currentPage = 1;
		this.pageSize = 18;
		this.maxSize = 10;
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let mediaData = {currentPage:this.currentPage,pageSize:this.pageSize}
    this.getMediaList(mediaData);
    // this.getCategoryList(this.data)
  }

  // Method to get media list
  getMediaList(data){
    this.spinner.show();
    this.service.getMediaList(this.token,data)
      .then((result) => {
            let serverResponce:any = result;
            this.mediaList = serverResponce.data.galleryImages;
            this.totalMedia = serverResponce.data.totalCount;
            // console.log(serverResponce,'serverResponce');          
            this.spinner.hide();
          }, (error)=>{
          // console.log('dsf',error);
          this.spinner.hide();
          if(error.error.status == 404){
            this.mediaList = [];
            // this.toasterService.pop('error', 'Error', error.error.message);  
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }
          // this.toasterService.pop('error', 'Error', error.statusText);
          
      });
  }

  // Method to get category list
  getCategoryList(data){
    this.spinner.show();
    this.service.getCategoryList(this.token,data)
      .then((result) => {
            let serverResponce:any = result;
            this.categoryList = serverResponce.data.categories
            // console.log(this.categoryList,'this.categoryList');          
            this.spinner.hide();
          }, (error)=>{
          // console.log('dsf',error);
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }

  // Method for pagination
	pageChange(currentPage,pageSize){
    this.data={currentPage:currentPage,pageSize:this.pageSize}
    this.getMediaList(this.data);
  }

  // Method for model
  open(content,media) {
    this.media = media;
    this.modalService.open(content, { size: 'lg',backdrop:false}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  // Method to get signed url
  imageUpload(event){ 
    if(event.target.files[0].type != 'image/jpeg' && event.target.files[0].type != 'image/png'){
      this.toastr.error("Please upload .png/.jpeg image only");
    }else{
      this.spinner.show();
      this.S3upload(event.target.files[0]).then(res => {            
        let serverResponce:any = res;   
        // console.log(serverResponce,'serverResponce');            
        this.media.imageUrl = serverResponce;
        this.spinner.hide();
      },err =>{
        // console.log(err,'err')
        this.toastr.error(err.error.message);
        this.spinner.hide();
      })
    }      
  }


  // Method to upload image in S3 Bucket
  S3upload(media){
    const promise = new Promise((resolve, reject) => {
        let mediaDataContent = {contentType : media.type,type:'GALLERY'};          
        // this.spinner.show();
        this.service.getSignedUrl(this.token,mediaDataContent)
          .then((res) => {
                let serverResponce:any = res;                  
                this.signedURL = serverResponce.data.signedURL;                  

                  this.service.S3upload(this.signedURL,media)
                      .then((res) => {                                                        
                           resolve(serverResponce.data.imageUrl);
                      }, (error)=>{                        
                      // this.spinner.hide();
                      this.toastr.error(error.error.message);
                      reject();
                  });  
            }, (error)=>{
            // console.log('dsf',error);
            // this.spinner.hide();
            this.toastr.error(error.error.message);           
            reject();
        });       
      })
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
    if(this.media.imageUrl == undefined || this.media.imageUrl == ''){
      this.toastr.error("Please upload image");
      return false;
    }

    if(this.media.title == undefined || this.media.title == ''){
      this.toastr.error("Please provide name");
      return false;
    }

    if(this.trimWhiteSpace(this.media.title)){
      this.toastr.error("Please provide name");
      return false;
    }

    return true;

  }


  // Method to update media
  submit(){
    let isValid = this.validateMedia();
    if(isValid){
      this.spinner.show();
      this.service.updateMedia(this.token,this.media)
      .then((result) => {
            let serverResponce:any = result;   
            this.toastr.success(serverResponce.message);      
            this.spinner.hide();
            let mediaData = {currentPage:this.currentPage,pageSize:this.pageSize}
            this.getMediaList(mediaData);
            // this.router.navigate(['/media']);
            $( ".close" ).trigger( "click" );
          }, (error)=>{
          // console.log('dsf',error);
          this.spinner.hide();
          if(error.status == 404 || error.status == 409){
            this.toastr.error(error.error.message);
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }  
          
      });
    }

  }

  // Method to search in gallery
  searchMedia(){
    if(this.filter){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        this.data = {searchText:this.filter,currentPage:this.currentPage,pageSize:this.pageSize}
        this.getMediaList(this.data);  
      },1000)
    }else{
      let mediaData = {currentPage:1,pageSize:this.pageSize}
      this.getMediaList(mediaData);
    }
  }

  // Method to delete media
  deleteMedia(media){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this image',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        let deleteData = {imageId:media.imageId,isActive:false}
        this.service.deleteMedia(this.token,deleteData)
        .then((result) => {
              let serverResponce:any = result;   
              this.toastr.success(serverResponce.message);      
              this.spinner.hide();
              let mediaData = {currentPage:this.currentPage,pageSize:this.pageSize}
              this.getMediaList(mediaData);  
                
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
