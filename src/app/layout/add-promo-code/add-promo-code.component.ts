import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDatepickerConfig, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-promo-code',
  templateUrl: './add-promo-code.component.html',
  styleUrls: ['./add-promo-code.component.scss'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class AddPromoCodeComponent implements OnInit {

  token:any;
  data:any={};
  promoCode:any={usageLimit:null};
  userLimit:number;
  // signedURL:any;
  // ckEditorConfig:any={};
  // datePickerConfig:any;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router,private activeRoute: ActivatedRoute,config: NgbDatepickerConfig) { }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let routeParams = this.activeRoute.snapshot.params;
    if(routeParams.id != '' && routeParams.id != 'add'){
      this.data={id:routeParams.id}
      this.getPromoCodeById(this.data);
    }
    document.getElementById("promocode-link").classList.add('router-link-active');
  }

  ngOnDestroy() {
    document.getElementById("promocode-link").classList.remove('router-link-active');
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

  // Method to validate promo code
  validatePromoCode(){

    if(this.promoCode.code == undefined || this.promoCode.code == ''){
      this.toastr.error("Please provide promo code");
      return false;
    }

    if(this.trimWhiteSpace(this.promoCode.code)){
      this.toastr.error("Please provide promo code");
      return false;
    }

    if(this.promoCode.startDate == undefined || this.promoCode.startDate == ''){
      this.toastr.error("Please select start date");
      return false;
    }

    if(this.promoCode.expireDate == undefined || this.promoCode.expireDate == ''){
      this.toastr.error("Please select expiry date");
      return false;
    }

    if(this.promoCode.startDate > this.promoCode.expireDate){
      this.toastr.error("start date cannot be greater than expiry date.");
      return false;
    }

    if(! ['percent', 'amount'].includes(this.promoCode.discountType)){
      this.toastr.error("Please provide discount type");
      return false;
    }

    if(this.promoCode.amountOff == undefined || this.promoCode.amountOff == null){
      this.toastr.error("Please provide off amount");
      return false;
    }

    if(this.promoCode.percentOff == undefined || this.promoCode.percentOff == null){
      this.toastr.error("Please provide off percentage");
      return false;
    }

    if(this.promoCode.durationInMonth == undefined || this.promoCode.durationInMonth == null || this.promoCode.durationInMonth == 0){
      this.toastr.error("Please provide month duration");
      return false;
    }

    if(this.promoCode.membershipId == undefined || this.promoCode.membershipId == ''){
      this.toastr.error("Please select membership");
      return false;
    }

    return true;
  }

  // Method to get date formate
  GetFormattedDate(d) {
    let date = new Date(d);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
  }

  // Method for create and update promo code
  submit(){
    let isValid = this.validatePromoCode();
    if(isValid){

      this.promoCode.startDate = this.GetFormattedDate(this.promoCode.startDate);
      this.promoCode.expireDate = this.GetFormattedDate(this.promoCode.expireDate);
      this.promoCode.membershipId = parseInt(this.promoCode.membershipId);

      if(this.promoCode.id){
        this.spinner.show();
          let updateData = {id:this.promoCode.id,startDate:this.promoCode.startDate,expireDate:this.promoCode.expireDate,membershipId:this.promoCode.membershipId };
          this.service.updatePromoCode(this.token,updateData)
              .then((result) => {
                  let serverResponce:any = result;
                  this.spinner.hide();
                  this.router.navigate(['/promocode']);
                  this.toastr.success(serverResponce.message);
              }, (error)=>{
              this.spinner.hide();
              if(error.status == 400 || error.status == 409){
                this.toastr.error(error.error.message);
              }else{
                this.toastr.error(error && error.message || "Server not responding.Please try again later.");
              }
          });
      }else{
        this.spinner.show();
        this.service.createPromoCode(this.token,this.promoCode)
            .then((result) => {
                let serverResponce:any = result;
                this.spinner.hide();
                this.router.navigate(['/promocode']);
                this.toastr.success(serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            if(error.status == 400 || error.status == 409){
              this.toastr.error(error.error.message);
            }else{
              this.toastr.error(error && error.message || "Server not responding.Please try again later.");
            }
        });
      }

    }

  }

  // Method to get promo code from Id
  getPromoCodeById(data){
    this.spinner.show();
    this.service.getPromoCodeById(this.token,data)
        .then((result) => {
            let serverResponce:any = result;
            this.promoCode = serverResponce.data.promocodeDetails;
            this.promoCode.startDate = new Date(serverResponce.data.promocodeDetails.startDate);
            this.promoCode.expireDate = new Date(serverResponce.data.promocodeDetails.expireDate);

            this.promoCode.discountType = serverResponce.data.promocodeDetails.discountType || 'percent';
            this.promoCode.percentOff = serverResponce.data.promocodeDetails.percentOff || 1;
            this.promoCode.amountOff = serverResponce.data.promocodeDetails.amountOff || 1;

            this.spinner.hide()
          }, (error)=>{
        this.spinner.hide();
        this.toastr.error(error && error.message || "Server not responding.Please try again later.");
    });
  }



}
