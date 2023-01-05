import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbTimeStruct, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import {copyObj} from "@angular/animations/browser/src/util";
declare var $: any

@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

  fromModel(value: string): NgbTimeStruct {
    if (!value) {
      return null;
    }
    const split = value.split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: parseInt(split[2], 10)
    };
  }

  toModel(time: NgbTimeStruct): string {
    if (!time) {
      return null;
    }
    return `${this.pad(time.hour)}:${this.pad(time.minute)}:${this.pad(time.second)}`;
  }

  private pad(i: number): string {
    return i < 10 ? `0${i}` : `${i}`;
  }
}

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss'],
  providers: [{provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter}]
})
export class AddBusinessComponent implements OnInit {

  @ViewChild('content') private content;

  token:string;
  data:any={};
  ownerList:any;
  categoryList:any;
  locationList:any;
  cityList:any;
  meridian = true;
  userDetails:any;
  signedURL:any;
  imageURL:any;
  profile:any = {event:'BUSINESS',image:'',cityId:''};
  isBasicMembership:any;
  ckEditorConfig:any={};
  step:number;
  businessId:any;
  newAddress:any={address:'',stateId:null,cityId:null,zipCode:'',businessMainImage:''};
  searchUser:string;
  // searchedUser=[];
  delayTimer:any;
  business:any={workingHours:[
                              {"day" : "Monday", "from1" : "", "to1" : "", "from2" : "", "to2" : ""},
                              {"day" : "Tuesday", "from1" : "", "to1" : "", "from2" : "", "to2" : ""},
                              {"day" : "Wednesday", "from1" : "", "to1" : "", "from2" : "", "to2" : ""},
                              {"day" : "Thursday", "from1" : "", "to1" : "", "from2" : "", "to2" : ""},
                              {"day" : "Friday", "from1" : "", "to1" : "", "from2" : "", "to2" : ""},
                              {"day" : "Saturday", "from1" : "", "to1" : "", "from2" : "", "to2" : ""},
                              {"day" : "Sunday", "from1" : "", "to1" : "", "from2" : "", "to2" : ""}
                            ],
                            geo:{},
                            businessImages:[],
                            userId:null
                };
  elements: Elements;
  card: StripeElement;
  stripDetails:any;
  memberShips = [];
  subscription:any = {};

  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en',
  };
  businessName: any;

  constructor(public router: Router, public service: ApiService,private spinner: NgxSpinnerService,private toastr: ToastrService,private modalService: NgbModal,private activeRoute: ActivatedRoute,private loadingBar: LoadingBarService,private stripeService: StripeService) {
    this.ckEditorConfig = {
          height: 200,
          language: "en",
          allowedContent: true,
          "toolbarGroups": [
                { name: 'basicstyles', "groups" : [ 'Bold','Italic','Strike','-','RemoveFormat' ] },
                { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align' ] },
                { name: 'links', "groups" : [ 'Link','Unlink','Anchor' ] },
                { name: 'styles', "groups" : [ 'Styles','Format','Font','FontSize' ] },
                { name: 'colors', "groups" : [ 'TextColor','BGColor' ] },
            ],
            "removeButtons":"Source,Save,Templates,Find,Replace,Scayt,SelectAll,forms,document"

    };

    $(document).ready(function(){
      setInterval(()=>{
        $('.memberships_box').click(function(){
          $('.memberships_box').removeClass("onselect");
          $(this).addClass("onselect");
        });
      },2000)

    });
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    this.getCategoryList(this.data);
    this.getLocationList();

    this.businessId = this.activeRoute.snapshot.params;
    if(this.businessId.id != '' && this.businessId.id != 'add'){
      let businessData = {userId:this.businessId.id}
      this.getBusinessById(businessData);
    }else{
      // let ownerData={type:'BUSINESS'}
      // this.getOwnerList(ownerData);
    }

     $(document).ready(function(){
        $(".steps-indicator").click(function(){
          $(this).toggleClass("togglelist");
        });
    });
    document.getElementById("business-link").classList.add('router-link-active');
    this.getMemberShipList();
  }

  ngOnDestroy() {
    document.getElementById("business-link").classList.remove('router-link-active');
  }

  // Method to remove place id
  addressRemoved(){
    this.business.placeId = "";
  }

  // Method to get geo location for selected address
  public handleAddressChange(address) {
    //this.business.address = address.formatted_address;
    this.business.address = address.name;
    this.business.geo.lat = address.geometry.location.lat();
    this.business.geo.lng = address.geometry.location.lng();
    this.business.placeId = address.place_id;
    this.business.utcOffset = address.utc_offset;
  }

  // Method to load strip card
  cardElement(){
    this.stripeService.elements(this.elementsOptions)
    .subscribe(elements => {
      this.elements = elements;
      // Only mount the element the first time
      if (!this.card) {
        this.card = this.elements.create('card', {
          hidePostalCode: true,
          style: {
            base: {
              iconColor: '#000',
              color: '#66421c',
              lineHeight: '40px',
              fontWeight: 300,
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSize: '18px',
              '::placeholder': {
                color: '#444'
              }
            }
          }

        });
        this.card.mount('#card-element');
      }
    });
  }

  // Method to get categories
  getCategoryList(data){
    this.spinner.show();
    this.service.getBusinessCategoryList(this.token,data)
      .then((result) => {
            let serverResponce:any = result;
            this.categoryList = serverResponce.data.categories;
            this.spinner.hide();
        }, (error)=>{
        this.spinner.hide();
        this.toastr.error("Server not responding.Please try again later.");
        // this.toastr.error(error.message)
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

        this.business.cityId = '';
        this.toastr.error(error.error.message);
    });
  }

  // Method to send selected city in image gallery
  selectedCity(city){
    this.profile.cityId = city;
  }

  // Method to upload slider image
  imageUpload(images) {
    let imageUploaded = images.target.files.length;
    let uploadedImages = this.business.businessImages.length;
    let totalImages = uploadedImages+imageUploaded;

    if(imageUploaded == 0 ){
      this.toastr.error("Please upload slider image.");
    }else if(imageUploaded > 30 ){
      this.toastr.error("You can add max 30 images..");
    }else if(totalImages > 30){
      this.toastr.error("You can add max 30 images..");
    }else{
      // if(images.target.files.length != 0){
        for(var i = 0;i < images.target.files.length; i++){
        if(images.target.files[i].type != 'image/jpeg' && images.target.files[0].type != 'image/png'){
this.toastr.error("Please upload .png/.jpeg image only");
}else{
	 this.S3upload(images.target.files[i],'BUSINESS').then(res => {
            let image:any = res;
            let sliderImage = {imageName:image,sequence:this.business.businessImages.length +1}
            // this.draggable.data = this.business.businessImages.push(sliderImage);
            this.business.businessImages.push(sliderImage);
            this.spinner.hide();
          },err =>{
            this.toastr.error(err.error.message);
          })
        }
	}
      // }
    }

  }

  // Method to upload business logo
  businessLogoUpload(event){
if(event.target.files[0].type != 'image/jpeg' && event.target.files[0].type != 'image/png'){
this.toastr.error("Please upload .png/.jpeg image only");
}else{
this.spinner.show();
this.S3upload(event.target.files[0],'businessLogo').then(res => {
let serverResponce:any = res;
this.business.businessMainImage = serverResponce;
this.spinner.hide();
},err =>{
this.spinner.show();
this.toastr.error(err.error.message);
})
}
  }

  // Method to upload image in S3 Bucket
  S3upload(media,type){
    const promise = new Promise((resolve, reject) => {
        let mediaDataContent = {contentType : media.type,type:type};
        this.spinner.show();
        this.service.getSignedUrl(this.token,mediaDataContent)
          .then((res) => {
                let serverResponce:any = res;
                this.signedURL = serverResponce.data.signedURL;

                  this.service.S3upload(this.signedURL,media)
                      .then((res) => {
                           resolve(serverResponce.data.imageUrl);
                      }, (error)=>{
                      this.spinner.hide();
                      this.toastr.error(error.statusText);
                      reject();
                  });
            }, (error)=>{
            this.spinner.hide();
            this.toastr.error(error.message)
            reject();
        });
      })
      return promise;
  }


  // Method to upload Brochure
  uploadBrochure(event){
    if(event.target.files[0].type != 'application/pdf'){
      this.toastr.error("Please upload pdf file.");
    }else{
      this.spinner.show();
      this.S3upload(event.target.files[0],'brochurePDF').then(res => {
        let serverResponce:any = res;
        this.business.brochure = serverResponce;
        this.spinner.hide();
      },err =>{
        this.spinner.show();
        this.toastr.error(err.error.message);
      })
    }

  }

  //  Method to upload menu
  uploadMenu(event){
    if(event.target.files[0].type != 'application/pdf'){
      this.toastr.error("Please upload pdf file.");
    }else{
      this.spinner.show();
      this.S3upload(event.target.files[0],'menuPDF').then(res => {
        let serverResponce:any = res;
        this.business.menu = serverResponce;
        this.spinner.hide();
      },err =>{
        this.spinner.show();
        this.toastr.error(err.error.message);
      })
    }

  }

  // Method to remove business Logo
  removeLogo(){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this logo',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.business.businessMainImage = '';
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

  // Method to remove Brochure
  removeBrochure(image){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this brochure',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.business.brochure = '';
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

  // Method to remove menu
  RemoveMenu(image){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this menu',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.business.menu = '';
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

  // Method to recive selected image from gallery
  receiveImage($event){
    this.business.businessMainImage = $event;
    this.newAddress.businessMainImage = $event;
  }




  // Method to remove sliderImage
  removeSlider(image){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this image',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.business.businessImages = this.business.businessImages.filter(item => item.sequence != image.sequence);
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

  // Method to trim white space
  trimWhiteSpace(value){
    let trim = value.trim()
    if(trim == ''){
      return true;
    }else{
      return false;
    }
  }

  // Method to remove html tag
  removeHTMLTag(content){
    var plainText = content.replace(/<[^>]*>/g, '');
    if(this.trimWhiteSpace(plainText)){
      return true;
    }else{
      return false;
    }
  }

  // Method to check if number
  isNumber(value) {
      let re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (re.test(value))
      {
          return true;
      } else
      {
          return false;
      }
  }

  // Method to validate
  validateBusiness(){

    if(!this.business.id){
      if(this.searchUser == undefined || this.searchUser == ''){
        this.toastr.error("Please select business owner in business info tab.");
        return false;
      }

      if(this.searchUser != '' && (this.business.userId == '' || this.business.userId == null)){
        this.toastr.error("Please select business owner from drop down.");
        return false;
      }
    }



    if(this.business.name != undefined && this.business.name != '' && this.trimWhiteSpace(this.business.name)){
      this.toastr.error("Please enter the business name in business info tab.");
      return false;
    }



    if(this.business.description != undefined && this.business.description != '' && this.trimWhiteSpace(this.business.description)){
      this.toastr.error("Please enter the description in business info tab.");
      return false;
    }



    if(this.step >= 2){
      for(var i=0;i<this.business.workingHours.length;i++){

        if(this.business.workingHours[i].from1 == null){
          this.business.workingHours[i].from1 = "";
        }
        if(this.business.workingHours[i].to1 == null){
          this.business.workingHours[i].to1 = "";
        }
        if(this.business.workingHours[i].from2 == null){
          this.business.workingHours[i].from2 = "";
          // this.toastr.error("Please provide valid time for "+this.business.workingHours[i].day+" in business hours tab");
          // return false;
        }
        if(this.business.workingHours[i].to2 == null){
          this.business.workingHours[i].to2 = "";
        }

        if(this.business.workingHours[i].from1 != '' && this.business.workingHours[i].to1 == ''){
          this.toastr.error("Please provide valid time for "+this.business.workingHours[i].day+" in business hours tab");
          return false;
        }
        if(this.business.workingHours[i].to1 != '' && this.business.workingHours[i].from1 == ''){
          this.toastr.error("Please provide valid time for "+this.business.workingHours[i].day+" in business hours tab");
          return false;
        }
        if(this.business.workingHours[i].to1 < this.business.workingHours[i].from1){
          this.toastr.error("Please provide valid time for "+this.business.workingHours[i].day+" in business hours tab");
          return false;
        }
        if(this.business.workingHours[i].from2 != '' && this.business.workingHours[i].to2 == ''){
          this.toastr.error("Please provide valid time for "+this.business.workingHours[i].day+" in business hours tab");
          return false;
        }
        if(this.business.workingHours[i].to2 != '' && this.business.workingHours[i].from2 == ''){
          this.toastr.error("Please provide valid time for "+this.business.workingHours[i].day+" in business hours tab");
          return false;
        }
        if(this.business.workingHours[i].to2 < this.business.workingHours[i].from2){
          this.toastr.error("Please provide valid time for "+this.business.workingHours[i].day+" in business hours tab");
          return false;
        }

      }
    }

    // }
    if(this.step >= 3){

      if(this.business.landmark != undefined && this.business.landmark != '' && this.trimWhiteSpace(this.business.landmark)){;
        this.toastr.error("Please enter the landmark in other info tab");
        return false;
      }

      if(this.business.address != undefined && this.business.address != '' && this.trimWhiteSpace(this.business.address)){
        this.toastr.error("Please enter the address in other info tab");
        return false;
      }

      if(this.business.address == undefined || this.business.address == ''){
        this.toastr.error("Please enter the address in other info tab");
        return false;
      }

      if(this.business.placeId == ''){
        this.toastr.error("Please select address from drop down in other info tab");
        return false;
      }

      // if(this.business.address != undefined && this.business.address != '' && this.trimWhiteSpace(this.business.address)){
      //   this.toastr.error("Please enter the address.");
      //   return false;
      // }

      // if(this.business.address != undefined && this.business.address != '' && this.business.placeId == undefined || this.business.placeId == ''){
      //   this.toastr.error("Please select the address from drop down in other info tab");
      //   return false;
      // }

      if(this.business.zipCode != undefined && this.business.zipCode != '' && this.trimWhiteSpace(this.business.zipCode)){
        this.toastr.error("Please enter the zipcode in other info tab");
        return false;
      }

      if(this.business.phoneNo != undefined && this.business.phoneNo != '' && this.trimWhiteSpace(this.business.phoneNo)){
        this.toastr.error("Please enter the phone number in other info tab");
        return false;
      }

      if(this.business.phoneNo != undefined && this.business.phoneNo != '' && !this.isNumber(this.business.phoneNo)){
        this.toastr.error("Please enter valid phone number in other info tab");
        return false;
      }
    }


    if(this.step >= 4){
      if(this.business.metaTitle != undefined && this.business.metaTitle != '' && this.trimWhiteSpace(this.business.metaTitle)){
        this.toastr.error("Please enter the meta title in business social tab");
        return false;
      }

      if(this.business.metaKeywords != undefined && this.business.metaKeywords != '' && this.trimWhiteSpace(this.business.metaKeywords)){
        this.toastr.error("Please enter the meta keywords in business social tab");
        return false;
      }
    }

    if(this.step >= 5){
      if(this.business.businessMainImage == undefined || this.business.businessMainImage == ''){
        this.toastr.error("Please select business Image in business image tab");
        return false;
      }
    }

    return true;


  }


  // Method to check step
  businessStep(step){
    this.step = step;
    this.validateBusiness();
  }

  // Method to scroll window to top
  scrollToTop(){
    window.scroll(0,0);
  }

  submit(){
    this.step =6;
    let isValid = this.validateBusiness();
    if(isValid){

      if(this.business.id){
        this.business.businessId = this.business.id;
      }else{
        this.business.businessId = 0;
      }
      this.business.categoryId = parseInt(this.business.categoryId);
      this.business.stateId = parseInt(this.business.stateId);
      this.business.cityId = parseInt(this.business.cityId);
      this.business.userId = parseInt(this.business.userId);
      this.spinner.show();
      this.service.createOrUpdateBusiness(this.token,this.business)
        .then((result) => {
              let serverResponce:any = result;

              this.router.navigate(['/business']);
              this.toastr.success(serverResponce.message);
              window.scroll(0,0);
              // this.router.navigate(['/user/deals']);
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status == 403){
            this.toastr.error(error.error.message);
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }

      });

    }
   }

   validateNewAddress(){

    if(this.newAddress.landmark != undefined && this.newAddress.landmark != '' && this.trimWhiteSpace(this.newAddress.landmark)){;
      this.toastr.error("Please enter the landmark");
      return false;
    }

    if(this.newAddress.address != undefined && this.newAddress.address != '' && this.trimWhiteSpace(this.newAddress.address)){
      this.toastr.error("Please enter the address");
      return false;
    }

    if(this.newAddress.address != undefined && this.newAddress.address != '' && this.business.placeId == undefined || this.business.placeId == ''){
      this.toastr.error("Please select the address from drop down");
      return false;
    }

    if(this.newAddress.zipCode != undefined && this.newAddress.zipCode != '' && this.trimWhiteSpace(this.newAddress.zipCode)){
      this.toastr.error("Please enter the zipcode");
      return false;
    }
    if(this.newAddress.businessMainImage == undefined || this.newAddress.businessMainImage == ''){
      this.toastr.error("Please select business Image in business image tab");
      return false;
    }
    return true;

   }


   // Method to open model
   open(content) {
    this.modalService.open(content, {}).result.then((result) => {
    }, (reason) => {

    });
  }

  // Method to remove selected city if state is changed
  removeCity(){
    this.newAddress.cityId = null;
  }

  // Method to update business location
  updateLocation(value){

    let isValid = this.validateNewAddress();
    if(isValid){
      let updateLocationData={businessId: this.business.id,cityId:value.cityId,stateId:parseInt(value.stateId),landmark:value.landmark,address:value.address,businessMainImage:value.businessMainImage,zipCode:value.zipCode}
      this.spinner.show();
      this.service.updateBusinessLocation(this.token,updateLocationData)
        .then((result) => {
              let serverResponce:any = result;
              // this.locationList = serverResponce.data.locations;
              this.toastr.success(serverResponce.message);
              window.scroll(0,0);
              $( ".close" ).trigger( "click" );
              // this.router.navigate(['/user/deals']);
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error(error.error.message);
      });
    }

  }


  // Method to get category from Id
  getBusinessById(data){
    this.spinner.show();
    this.service.getBusinessById(this.token,data)
        .then((result) => {
            let serverResponce:any = result;
            this.business = serverResponce.data.businessDetails;
            this.selectCity(serverResponce.data.businessDetails.stateId);
            this.profile.image = this.business.businessMainImage;
            this.profile.cityId = serverResponce.data.businessDetails.cityId;
            this.business.cityId = serverResponce.data.businessDetails.cityId;
            this.spinner.hide();
          }, (error)=>{
        this.spinner.hide();
        if(error.error.status == 403){
          this.cardElement();
          this.open(this.content);
          this.toastr.error(error.error.message);
        }else{
          this.toastr.error("Server not responding.Please try again later.");
        }

    });
  }

  // Method to search business owner
  searchBusinessOwner(){
    this.searchUser = this.searchUser.trim();
    if(!this.searchUser){
      this.ownerList = [];
    }
    if(this.searchUser){
      this.business.userId = null;
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        this.loadingBar.start();
        let searchData = {searchText:this.searchUser,type:'BUSINESS'};
        this.service.getOwnerList(this.token,searchData)
        .then((result) => {
            let serverResponce:any = result;
            this.ownerList = serverResponce.data.memberList;

        }, (error)=>{
          this.ownerList = [];

          if(error.error.status == 404){
            this.toastr.error(error.error.message);
          }
          if(error.error.status != 404){
            this.toastr.error("Server not responding.Please try again later.");
          }

        });
      },500)
    }
  }

  // Method to get selected location
  selectedUser(value){
    this.searchUser = value.firstName +" "+ value.lastName +" "+ "("+value.username+")";
    this.business.userId = value.id;
  }

  // Method to empty location
  closeUserSuggestion(){
    this.ownerList = [];
  }

  // Service to get location list
  getMemberShipList(){
      this.spinner.show();
      this.service.getMemberShipList(this.token)
        .then((result) => {
              let serverResponce:any = result;
              this.memberShips = serverResponce.data.memberShipDetails;
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }

  // Method to create token in strip
  buy() {
    // const name = this.name;
    this.spinner.show();
    const promise = new Promise((result, error) => {
      this.stripeService
      .createToken(this.card, {  })
      .subscribe(token => {
        if (token.token) {
          this.stripDetails = token.token;

          result(true);
          this.spinner.hide();
        } else {
          // Error creating the token
          error(false);
          this.spinner.hide();
        }
      });
    });
    return promise
  };

  // Method to get selected membership
  selectedMembership(value){
    // console.log(value,'test');
    this.subscription.membership = value;
  }

  // Method to crate subscription
  creatSubscription(){
    if(this.subscription.membership == undefined || this.subscription.membership == null){
      this.toastr.error("Please select membership plan");
      // return false;
    }else{
      this.buy().then(succ => {
        let subscriptionData = { userId: this.business.userId, membershipId:this.subscription.membership,cardToken:this.stripDetails.id }
        this.spinner.show();
        this.service.createSubscription(this.token,subscriptionData)
          .then((result) => {
              let serverResponce:any = result;
              this.toastr.success(serverResponce.message);
              // localStorage.setItem('isMembership', 'true');
              $( ".close" ).trigger( "click" );
              this.router.navigate(['/business']);
              this.spinner.hide();
          }, (error)=>{
              this.spinner.hide();
              let serverError = error.error.message;
              this.toastr.error(serverError);
          });

      },err =>{
        // console.log(err,'err')
        this.toastr.error("Please provide valid card details");
      })
    }

  }


}
