import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class AddBannerComponent implements OnInit {

  banner:any={};
  token:any;
  signedURL:any;
  locationList:any;
  cityList:any;

  constructor(public router: Router, public service: ApiService,private spinner: NgxSpinnerService,private toastr: ToastrService,private activeRoute: ActivatedRoute,private modalService: NgbModal,config: NgbDatepickerConfig) { 
    const currentDate = new Date();
    config.minDate = {year:currentDate.getFullYear(), month:currentDate.getMonth()+1, day: currentDate.getDate()};
    config.outsideDays = 'hidden';

    this.banner.utcOffset = new Date().getTimezoneOffset() * (-1);
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }

    document.getElementById("banner-link").classList.add('router-link-active');
    let routeParams = this.activeRoute.snapshot.params;
    if(routeParams.id != '' && routeParams.id != 'add'){
      let detailData = {bannerId:routeParams.id}
      this.getBannerById(detailData);
    }
    this.getLocationList();
  }

  ngOnDestroy() {
    document.getElementById("banner-link").classList.remove('router-link-active');
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
        this.banner.imageUrl = serverResponce;
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
        let mediaDataContent = {contentType : media.type,type:'BANNERS'};          
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

  // Method to remove spaces
  trimWhiteSpace(value){
    let trim = value.trim()
    if(trim == ''){
      return true;
    }else{
      return false;
    }
  }

  // Method to check if link
  isLink(value) {
    // let re = new RegExp("/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/");
    let re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (re.test(value))
    {
        return true;
    } else
    {
        return false;
    }
  }



  // Method validate banner
  validateBanner(){

    if(this.banner.title == undefined || this.banner.title == ''){
      this.toastr.error("Please provide title");
      return false;
    }

    if(this.trimWhiteSpace(this.banner.title)){
      this.toastr.error("please provide title");
      return false;
    }
    
    if(this.banner.hyperLink == undefined || this.banner.hyperLink == ''){
      this.toastr.error("Please provide hyperLink");
      return false;
    }

    if(this.trimWhiteSpace(this.banner.hyperLink)){
      this.toastr.error("please provide hyperLink");
      return false;
    }

    if(!this.isLink(this.banner.hyperLink)){
      this.toastr.error("please provide valid hyperLink with http/https");
      return false;
    }

    if(this.banner.startDate == undefined || this.banner.startDate == null){
      this.toastr.error("please provide start date");
      return false;
    }

    if(this.banner.expireDate == undefined || this.banner.expireDate == null){
      this.toastr.error("please provide expire date");
      return false;
    }

    if(this.banner.startDate > this.banner.expireDate){
      this.toastr.error("start date cannot be greater than expire date.");
      return false;
    }

    if(this.banner.stateId == undefined || this.banner.stateId == ''){
      this.toastr.error("please select state");
      return false;
    }

    if(this.banner.cityId == undefined || this.banner.cityId == ''){
      this.toastr.error("please select city");
      return false;
    }

    if(this.banner.imageUrl == undefined || this.banner.imageUrl == ''){
      this.toastr.error("please upload image");
      return false;
    }
    return true
  }

  // Method to get date formate
  GetFormattedDate(d) {
    let date = new Date(d);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
  }

  //Method for final submit
  submit(){
    let isValid = this.validateBanner();
    if(isValid){
      this.banner.startDate = this.GetFormattedDate(this.banner.startDate);
      this.banner.expireDate = this.GetFormattedDate(this.banner.expireDate);
      if(this.banner.id){
        this.spinner.show();
        this.service.updateBanner(this.token,this.banner)
            .then((result) => {
                let serverResponce:any = result;
                // this.eventMessage.emit(this.imageURL);
                this.spinner.hide();
                this.router.navigate(['/banners']);
                this.toastr.success(serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            this.banner.startDate = new Date(this.banner.startDate);
            this.banner.expireDate = new Date(this.banner.expireDate);
            if(error.status == 409){
              this.toastr.error(error.error.message);
            }else{
              this.toastr.error("Server not responding.Please try again later.");
            }
        });
      }else{
        this.spinner.show();
        this.service.createBanner(this.token,this.banner)
            .then((result) => {
                let serverResponce:any = result;
                // this.eventMessage.emit(this.imageURL);
                this.spinner.hide();
                this.router.navigate(['/banners']);
                this.toastr.success(serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            this.banner.startDate = new Date(this.banner.startDate);
            this.banner.expireDate = new Date(this.banner.expireDate);
            if(error.status == 400 || error.status == 409){
              this.toastr.error(error.error.message);
            }else{
              this.toastr.error("Server not responding.Please try again later.");
            }
        });
      }
        
    }
  }

  // Method to remove image
  removeImage(){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this image',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.banner.imageUrl = '';    
        swal(
          'Success',
          '',
          'success'
        )
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal(
          'Cancelled',
          '',
          'error'
        )
      }
    })
  }


  // Method to get banner from Id
  getBannerById(data){
    this.spinner.show();
    this.service.getBannerById(this.token,data)
        .then((result) => {
            let serverResponce:any = result;
            console.log(serverResponce,'serverResponce');
            this.banner = serverResponce.data.bannersDetails;
            this.banner.startDate = new Date(serverResponce.data.bannersDetails.startDate);
            this.banner.expireDate = new Date(serverResponce.data.bannersDetails.expireDate);
            this.selectCity(serverResponce.data.bannersDetails.stateId);
            // console.log(this.location,'this.location');
            this.spinner.hide()
          }, (error)=>{
        this.spinner.hide();
        this.toastr.error("Server not responding.Please try again later.");
    });
  }


  // Service to get location list
  getLocationList(){
    this.spinner.show();
    this.service.getBusinessLocationList(this.token)
      .then((result) => {
            let serverResponce:any = result;
            this.locationList = serverResponce.data.locations;
            this.spinner.hide();
        }, (error)=>{
        this.spinner.hide();
        this.toastr.error("Server not responding.Please try again later.");
    });
}

// Method to get city for seleted location
selectCity(value){
  let location = {locationId:value};
  this.spinner.show();
  this.service.getCityList(this.token,location)
    .then((result) => {
          let serverResponce:any = result;
          this.cityList = serverResponce.data.subLocations;
          this.spinner.hide();
      }, (error)=>{
      this.spinner.hide();
      this.cityList = [];
      this.banner.cityId = '';
      this.toastr.error(error.error.message);  
  });
}





}
