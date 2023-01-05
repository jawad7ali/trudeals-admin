import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {MovingDirection} from 'angular-archwizard';
import {NgbModule, NgbModal, NgbDatepickerConfig, NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@ngx-loading-bar/core';
declare var $: any

@Component({
  selector: 'app-add-deals',
  templateUrl: './add-deals.component.html',
  styleUrls: ['./add-deals.component.scss'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class AddDealsComponent implements OnInit {

  addDeal={};
  deal:any={isFeatured:false,businessId:null,tnc:'•New customers only, limit one per person.• Cannot be used with any other offer or promotion.• Does not include gratuity.• 24 hr. cancellation policy• Must present this deal voucher at the time of service/booking.• Printed or Mobile copy must be made available upon arrival.'};
  token:string;
  userDetails:any;
  data:any={};
  categoryList:any;
  locationList:any;
  cityList:any;
  businessList:any;
  date:any={endDate:'',startDate:''};
  steps:number;
  public canExitStep1:boolean;
  detailData:any={};
  profile:any = {event:'DEAL',image:'',cityId:''};
  delayTimer:any;
  searchBusiness:string;
  ckEditorConfig:any={};

  constructor(public router: Router, public service: ApiService,private spinner: NgxSpinnerService,private toastr: ToastrService,private activeRoute: ActivatedRoute,private modalService: NgbModal,config: NgbDatepickerConfig,private loadingBar: LoadingBarService) { 
    const currentDate = new Date();
    config.minDate = {year:currentDate.getFullYear(), month:currentDate.getMonth()+1, day: currentDate.getDate()};
    config.outsideDays = 'hidden';
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
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    this.getCategoryList(this.data);
    this.getLocationList();
    // this.getBusinessList();

    let routeParams = this.activeRoute.snapshot.params;
    if(routeParams.id != '' && routeParams.id != 'deal'){
      // console.log(routeParams,'routeParams');
      this.deal.dealId = routeParams.id;
      let businessId = routeParams.businessId;
      this.detailData={dealId:this.deal.dealId,businessId: businessId};
      this.getDealById(this.detailData);
    }


    document.getElementById("deals-link").classList.add('router-link-active');
  	$(document).ready(function(){
        $(".steps-indicator").click(function(){
          $(this).toggleClass("togglelist");
        });
    });
  }

  ngOnDestroy() {
    document.getElementById("deals-link").classList.remove('router-link-active');
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
          this.deal.cityId = '';
          this.toastr.error(error.error.message);  
      });
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



    // Method to validate deal
    validateDeals(){
      // if(this.deal.title == undefined || this.deal.title == ''){
      //   this.toastr.error("Please enter the title.");
      //   return false;
      // }

      if(!this.deal.id){
        if(this.searchBusiness == undefined || this.searchBusiness == '' ){
          this.toastr.error("Please select business name in deal info tab");
          return false;
        }
  
        if(this.searchBusiness != undefined && this.deal.businessId == null ){
          this.toastr.error("Please select business name from drop down.");
          return false;
        }
      }
      

      if(this.deal.title != undefined && this.deal.title != '' && this.trimWhiteSpace(this.deal.title)){
        this.toastr.error("Please enter the title in deal info tab.");
        return false;
      }
      
      if(this.deal.description != undefined && this.deal.description != '' && this.trimWhiteSpace(this.deal.description)){
        this.toastr.error("Please enter the description in deal info tab.");
        return false;
      }

      if(this.deal.description != undefined && this.deal.description != '' && this.removeHTMLTag(this.deal.description)){
        this.toastr.error("Please enter the description in deal info tab.");
        return false;
      }

      // if(this.deal.description != undefined && this.deal.description != '' && this.removeHTMLTag(this.deal.description)){
      //   this.toastr.error("Please enter the description in step 1.");
      //   return false;
      // }

      if(this.steps >= 2){
        if(this.deal.categoryId == undefined || this.deal.categoryId == ''){
          this.toastr.error("Please select category in deal image tab.");
          return false;
        }

        if(this.deal.stateId == undefined || this.deal.stateId == ''){
          this.toastr.error("Please select state in deal image tab.");
          return false;
        }

        if(this.deal.cityId == undefined || this.deal.cityId == ''){
          this.toastr.error("Please select city in deal image tab.");
          return false;
        }

        if(this.deal.imageUrl == undefined || this.deal.imageUrl == ''){
          this.toastr.error("Please select image from gallery in deal image tab.");
          return false;
        }
      }

      if(this.steps >= 3){
        if(this.deal.startDate == undefined || this.deal.startDate == ''){
          this.toastr.error("Please select start date in deal price tab.");
          return false;
        }


        if(this.deal.expireDate == undefined || this.deal.expireDate == ''){
          this.toastr.error("Please select expiry date deal price tab.");
          return false;
        }
        
        if(this.deal.startDate > this.deal.expireDate){
          this.toastr.error("start date cannot be greater than expiry date.");
          return false;
        }

        if(this.deal.dealOffered == undefined || this.deal.dealOffered == ''){
          this.toastr.error("Please enter number of deal offered in deal price tab.");
          return false;
        }

        if(this.deal.retailValue == undefined || this.deal.retailValue == ''){
          this.toastr.error("Please enter deal retail value in deal price tab.");
          return false;
        }

        if(this.deal.dealPrice == undefined || this.deal.dealPrice == ''){
          this.toastr.error("Please enter deal price in deal price tab.");
          return false;
        }

        // if(this.deal.dealType == undefined || this.deal.dealType == ''){
        //   this.toastr.error("Please select type of de in deal price tab.");
        //   return false;
        // }

        if(this.deal.dealType == 'CART'){
          // if(this.deal.promoCode == undefined || this.deal.promoCode == ''){
          //   this.toastr.error("Please enter deal promoCode deal price tab.");
          //   return false;
          // }

          if(this.deal.shoppingCartUrl == undefined || this.deal.shoppingCartUrl == ''){
            this.toastr.error("Please enter shopping cart url deal type tab.");
            return false;
          }

        }


      }
      
      return true;

    }

    // Method to check step
    dealStep(step){
      this.steps = step;
      // this.canExitStep1 = false;
      this.validateDeals();
    }

    // Method to scroll window to top
    scrollToTop(){
      window.scroll(0,0);
    }

    // Method to recive selected image from gallery
    receiveImage($event){
      this.deal.imageUrl = $event;
      this.profile.image = $event;
    }

    // Method to get date formate
    GetFormattedDate(d) {
      let date = new Date(d);
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    }

    // Method to send selected city in image gallery
    selectedCity(city){
      this.profile.cityId = city; 
    }


    // Method to calculate percentage
    calculateOffPercent(dealPrice){
      if(this.deal.dealPrice == undefined || this.deal.dealPrice == null || this.deal.retailValue == undefined || this.deal.retailValue == null){
        // this.toastr.error("deal price required");
        this.deal.offerPercentage = 0;
      }
      else if(this.deal.retailValue != undefined && this.deal.dealPrice != undefined && this.deal.dealPrice > this.deal.retailValue){
        this.toastr.error("retail price cannot to less than deal prize");
      }else{
        // Discount = Marked Price - Selling Price
        if(this.deal.retailValue != undefined && this.deal.dealPrice != undefined){
          let discount = this.deal.retailValue - this.deal.dealPrice;
          // this.deal.offerPercentage = (discount/this.deal.retailValue) * 100; 
          let originalPercent = (discount/this.deal.retailValue) * 100; 
          this.deal.offerPercentage = originalPercent.toFixed(2);

        }else{
          this.deal.offerPercentage = 0;
        }
        
        // Discount% = Discount/Marked Price × 100%.
        // this.deal.offerPercentage = (this.deal.dealPrice/this.deal.retailValue)*100
      }
    }

  // Method for final submit
  submit(){
      this.steps = 4; 
      let isValid = this.validateDeals();
      if(isValid){
        this.deal.startDate = this.GetFormattedDate(this.deal.startDate);
        this.deal.expireDate = this.GetFormattedDate(this.deal.expireDate);
        this.deal.businessId = parseInt(this.deal.businessId)
        if(this.deal.id){
          this.deal.dealId = this.deal.id;
          this.spinner.show();
          this.service.updateDeal(this.token,this.deal)
            .then((result) => {
                  let serverResponce:any = result;
                  // this.locationList = serverResponce.data.locations;
                  this.toastr.success(serverResponce.message);
                  this.router.navigate(['/deals']);
                  this.spinner.hide();
              }, (error)=>{
              this.spinner.hide();
              this.deal.startDate = new Date(this.deal.startDate);
              this.deal.expireDate =  new Date(this.deal.startDate);
              if(error.error.status == 403){
                this.toastr.error(error.error.message);  
              }else{
                this.toastr.error("Server not responding.Please try again later.");  
              }
              // this.toastr.error(error.message);  
          });
        }
        else{
          this.spinner.show();
          this.service.createDeal(this.token,this.deal)
            .then((result) => {
                  let serverResponce:any = result;
                  // this.locationList = serverResponce.data.locations;
                  this.toastr.success(serverResponce.message);
                  this.router.navigate(['/deals']);
                  this.spinner.hide();
              }, (error)=>{
              this.spinner.hide();
              this.deal.startDate = new Date(this.deal.startDate);
              this.deal.expireDate =  new Date(this.deal.startDate);
              
              if(error.error.status == 403){
                this.toastr.error(error.error.message);  
              }else{
                this.toastr.error("Server not responding.Please try again later.");
              }
              
          });
        }
      }
    }
    
    // Method to get location from Id
  getDealById(data){
    this.spinner.show();
    this.service.getDealById(this.token,data)
        .then((result) => {
            let serverResponce:any = result;
            // console.log(serverResponce,'serverResponce');
            this.deal = serverResponce.data.deal;
            this.profile.image = this.deal.imageUrl;
            this.profile.cityId = this.deal.cityId;
            this.selectCity(serverResponce.data.deal.stateId);
            this.deal.startDate = new Date(serverResponce.data.deal.startDate);
            this.deal.expireDate =  new Date(serverResponce.data.deal.expireDate);
            this.searchBusiness = serverResponce.data.deal.businessName+" ("+serverResponce.data.deal.businessUniqueId+")"
            // this.getBusinessList();
            this.spinner.hide()
          }, (error)=>{
        this.spinner.hide();
        if(error.error.status == 403){
          this.toastr.error(error.error.message);  
        }else{
          this.toastr.error("Server not responding.Please try again later.");  
        }
        // this.toastr.error(error.statusText);
    });
  } 
  
    // Method to open model
  open(content) {
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
    }, (reason) => {
    });
  }


  // Method to search business owner
  searchDealsOwner(){
    this.searchBusiness = this.searchBusiness.trim();
    if(!this.searchBusiness){
      this.businessList = [];
    }
    if(this.searchBusiness){
      this.deal.businessId = null;
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        this.loadingBar.start();
        let searchData = {searchText:this.searchBusiness};
        this.service.getBusinessDealList(this.token,searchData)
          .then((result) => {
                let serverResponce:any = result;
                // console.log(serverResponce,'serverResponce');
                this.businessList = serverResponce.data.businessList;
                // console.log(this.businessList,'this.businessList');
                this.loadingBar.complete();
            }, (error)=>{
              this.businessList = [];
              this.loadingBar.complete();  
            // this.spinner.hide();
            if(error.error.status == 404){
              this.toastr.error(error.error.message);
            }
            if(error.error.status != 404){
              this.toastr.error("Server not responding.Please try again later.");
            }
            // this.toastr.error("Server not responding.Please try again later.");
        });
      },500)
    }
  }



  // Method to get selected business
  selectedBusiness(value){
    // console.log(value,'value');
    this.searchBusiness = value.businessName +" ("+ value.businessUniqueId +") "
    this.deal.businessId = value.businessId;
    this.deal.stateId = value.stateId; 
    this.selectCity(value.stateId);
    this.deal.cityId = value.cityId; 
    this.profile.cityId = value.cityId;
  }

  // Method to empty business owner list
  closeBusinessSuggestion(){
    this.businessList = [];
  }

  // Method to clear promocode and shoppingCartUrl
  DealTypeChange(){
    this.deal.promoCode = "";
    this.deal.shoppingCartUrl = "";
  }

}
 

