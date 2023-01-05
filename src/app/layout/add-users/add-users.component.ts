import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
declare var $: any

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss'],
  animations: [routerTransition()]
})
export class AddUsersComponent implements OnInit {

  token:string;
  user:any={};
  data:any={};
  delayTimer:any;
  userNameAvailable:boolean;
  userNameSearch:any = {};
  elements: Elements;
  card: StripeElement;
  stripDetails:any;
  memberShips = []; 
  couponApplied:string;
  couponRejected:string;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router,private activeRoute: ActivatedRoute,private stripeService: StripeService) { 
      $(document).ready(function(){
        setInterval(()=>{
          $('.memberships_box').click(function(){
            $('.memberships_box').removeClass("onselect");
            $(this).addClass("onselect");
          });
        },2000)
          
      });
  }

  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en',
  };

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let routeParams = this.activeRoute.snapshot.params;
    if(routeParams.id != '' && routeParams.id != 'add'){
      // console.log(routeParams.id,'routeParams.id');
      this.data={userId:routeParams.id}
      this.getUserById(this.data);
    }
    document.getElementById("usr-link").classList.add('router-link-active');
    this.getMemberShipList();

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

  ngOnDestroy() {
    document.getElementById("usr-link").classList.remove('router-link-active');
  }

  // Method to search username
  searchUsername(){
    if(!this.user.username){
      // this.locationOption = [];
    }
    let check = this.user.username.trim();
    if(check != ''){
      if(this.user.username.length >= 6){
        clearTimeout(this.delayTimer);
        this.delayTimer = setTimeout(() =>{
          if(this.user.id){
            this.userNameSearch = {username:this.user.username,userId:this.user.id,accountType:this.user.accountType};  
          }else{
            this.userNameSearch = {username:this.user.username,userId:0,accountType:this.user.accountType};
          }
          
          this.service.searchUsername(this.userNameSearch)
            .then((result) => {
                  let serverResponce:any = result;
                  this.userNameAvailable = true;
                  // this.locationOption = serverResponce.data.locationList
              }, (error)=>{
                if(error.status == 404 || error.status == 409){
                  this.userNameAvailable = false;
                  //this.toastr.error(error.error.message);
                }else{
                  this.toastr.error("Server not responding.Please try again later.");
                }
                  
          });
        },750)
      }
    }
    
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

  // Method to check valid email
  isLink(value) {
      let re = new RegExp("[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?");
      if (re.test(value))
      {
          return true;
      } else
      {
          return false;          
      }
  }

  // Method to validate
  validateUser(){

    if(this.user.username == undefined || this.user.username == ''){
      this.toastr.error("Please provide username");
      return false;
    }

    if(this.trimWhiteSpace(this.user.username)){
      this.toastr.error("Please provide username");
      return false;
    }

    if(this.user.username.length < 6){
      this.toastr.error("Username cannot be less than 6 character");
      return false; 
    }

    if(this.user.email == undefined || this.user.email == ''){
      this.toastr.error("Please provide email");
      return false;
    }

    if(this.trimWhiteSpace(this.user.email)){
      this.toastr.error("Please provide email");
      return false;
    }

    if (!this.isLink(this.user.email)) {
      this.toastr.error("Please provide valid email");
      return false;
    }

    if(this.user.firstName == undefined || this.user.firstName == ''){
      this.toastr.error("Please provide first name");
      return false;
    }

    if(this.trimWhiteSpace(this.user.firstName)){
      this.toastr.error("Please provide name");
      return false;
    }

    if(this.user.lastName == undefined || this.user.lastName == ''){
      this.toastr.error("Please provide last name");
      return false;
    }

    if(this.trimWhiteSpace(this.user.lastName)){
      this.toastr.error("Please provide last name");
      return false;
    }

    if(this.user.phoneNo == undefined || this.user.phoneNo == ''){
      this.toastr.error("Please provide phone number");
      return false;
    }

    if(this.trimWhiteSpace(this.user.phoneNo)){
      this.toastr.error("Please provide phone numbmer");
      return false;
    }

    if(this.user.address == undefined || this.user.address == ''){
      this.toastr.error("Please provide address");
      return false;
    }

    if(this.trimWhiteSpace(this.user.address)){
      this.toastr.error("Please provide address");
      return false;
    }

    if(!this.user.id){
      if(this.user.membership == undefined || this.user.membership == ''){
        this.toastr.error("Please select membership plan");
        return false;
      }
    }

    return true;
  }



  // Final submit method
  submit(){
    let valid = this.validateUser();
    if(valid){
      if(this.user.id){
        this.spinner.show();
        this.service.updateUser(this.token,this.user)
            .then((result) => {
                let serverResponce:any = result;
                this.spinner.hide();
                this.router.navigate(['/users']);
                this.toastr.success(serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            if(error.status == 400 || error.status == 409 || error.status == 404){
              this.toastr.error(error.error.message);
            }else{
              this.toastr.error("Server not responding.Please try again later.");
            }
            
        });  
      }else{
        this.buy().then(succ => {
          let addData = { firstName:this.user.firstName,lastName:this.user.lastName,username:this.user.username,email:this.user.email,cardToken:this.stripDetails.id,membershipId:this.user.membership, coupon:this.user.coupon,phoneNo:this.user.phoneNo,address:this.user.address};
          this.spinner.show();
          this.service.createUser(this.token,addData)
              .then((result) => {
                  let serverResponce:any = result;
                  this.spinner.hide();
                  this.router.navigate(['/users']);
                  this.toastr.success(serverResponce.message);
              }, (error)=>{
              this.spinner.hide();
              if(error.status == 400 || error.status == 409 || error.status == 409){
                this.toastr.error(error.error.message);
              }else{
                this.toastr.error("Server not responding.Please try again later.");
              }
          });
        },err =>{
          // console.log(err,'err')
          this.toastr.error("Please provide valid card details");
        })
      }
      
    }    
  }


    // Method to get user from Id
    getUserById(data){
      this.spinner.show();
      this.service.getUserById(this.token,data)
          .then((result) => {
              let serverResponce:any = result;
              this.user = serverResponce.data.userDetail;
              this.spinner.hide()
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
        // console.log(token,'token');
        if (token.token) {
          this.stripDetails = token.token;
          // console.log(this.stripDetails,'this.stripDetails')
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
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

  // Service to get membership list
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

  // Method to get selected membership
  selectedMembership(value){
    this.user.membership = value;
  }

  // Method to validate promo code
  validatePromoCode(){
    if(this.user.membership == undefined || this.user.membership == ''){
      this.toastr.error("Please select membership plan");
      return false;
    }

    if(this.user.coupon == undefined || this.user.coupon == ''){
      this.toastr.error("Please provide promo code");
      return false;
    }

    if(this.trimWhiteSpace(this.user.coupon)){
      this.toastr.error("Please provide promo code");
      return false;
    }

    return true;
  }

  // Method to apply promo code 
  applyPromoCode(){
    let isValid = this.validatePromoCode();
    if(isValid){
      this.couponApplied = '';
      this.couponRejected = '';

      this.spinner.show();
      let promoCodeData = {promocode:this.user.coupon,membershipId: this.user.membership}
      this.service.applyPromoCode(this.token,promoCodeData)
        .then((result) => {
              let serverResponce:any = result;
              // console.log(serverResponce,'serverResponce');
              this.couponApplied = serverResponce.data.discountPrice;
              // this.memberShips = serverResponce.data.memberShipDetails;
              // console.log(this.memberShips,'this.memberShips');
              this.spinner.hide();
          }, (error)=>{
            // console.log(error,'error');
          this.spinner.hide();
          if(error.error.status == 404 || error.error.status == 403){
            this.couponRejected = error.error.message;
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }
          
      });
    }
  }






    
}












