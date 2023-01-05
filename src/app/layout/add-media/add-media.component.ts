import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.scss'],
  animations: [routerTransition()]
})
export class AddMediaComponent implements OnInit {

  token:any;
  data:any={};
  media:any={};
  categoryList:any;
  signedURL:any;
  

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router,private activeRoute: ActivatedRoute) {
  }
  

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    this.getCategoryList(this.data);
    document.getElementById("media-link").classList.add('router-link-active');    
  }
  
  ngOnDestroy() {
    document.getElementById("media-link").classList.remove('router-link-active');
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
        this.toastr.error(err.error.message);
        this.spinner.hide();
      })
    }    
      
  }


  // Method to upload image in S3 Bucket
  S3upload(media){
    const promise = new Promise((resolve, reject) => {
        let mediaDataContent = {contentType : media.type,type:'GALLERY' };          
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


  // Method to get category list
  getCategoryList(data){
    this.spinner.show();
    this.service.getCategoryList(this.token,data)
      .then((result) => {
            let serverResponce:any = result;
            this.categoryList = serverResponce.data.categories
            // console.log(serverResponce,'serverResponce');          
            this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error(error.statusText);
      });
  }

  // Method to delete image
  deleteImage(){
    this.media.imageUrl = "";
  }

  // Method to trim white space
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

    if(this.media.title.length < 2){
      this.toastr.error("Please provide name with atleast 3 character");
      return false;
    }
    
    return true;

  }

  // Method to create media
  submit(){
    let isValid = this.validateMedia();
    if(isValid){
      this.spinner.show();
      this.service.createMedia(this.token,this.media)
      .then((result) => {
            let serverResponce:any = result;
            // console.log(serverResponce,'serverResponce');
            this.toastr.success(serverResponce.message);          
            this.spinner.hide();
            this.router.navigate(['/media']);
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status == 409 || error.status == 404 ){
            this.toastr.error(error.error.message);
          }else{
            this.toastr.error("Server not responding. Please try after sometime.");
          }
                    
      });
    }

  }


}
