import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ApiService} from "../../api.service";
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any

@Component({
  selector: 'app-add-admins',
  templateUrl: './add-admins.component.html',
  styleUrls: ['./add-admins.component.scss']
})

export class AddAdminsComponent implements OnInit {
  token:string;
  user:any={};
  data:any={};
  delayTimer:any;
  userNameAvailable:boolean;
  userNameSearch:any = {};
  memberShips = []; 
  couponApplied:string;
  couponRejected:string;

  constructor(public service: ApiService, private toastr: ToastrService, public router: Router, private spinner: NgxSpinnerService, private activeRoute: ActivatedRoute
    ) {  $(document).ready(function(){
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

  // Method to trim white space
  trimWhiteSpace(value){
    let trim = value.trim()
    if(trim == ''){
      return true;
    }else{
      return false;
    }
  }

  validateUser(){

    if(this.user.username == "undefined" || this.user.username == ''){
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
    return true;

  }

  //Final Submit Method
  submit(){
    let valid = this.validateUser();
    if(valid){
      if(this.user.id){
        this.spinner.show();
        this.service.updateAdmin(this.token, this.user)
        .then((result)=>{
          let serverResponce:any = result;
          this.spinner.hide();
          this.router.navigate(['/users']);
          this.toastr.success(serverResponce.message);
        }, (error)=> {
          this.spinner.hide();
          if(error.status == 400 || error.status == 409 || error.status == 404){
            this.toastr.error(error.error.message);
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }
        });
      }else{
        let addData = { firstName:this.user.firstName,lastName:this.user.lastName,username:this.user.username,email:this.user.email,phoneNo:this.user.phoneNo,address:this.user.address};
        this.spinner.show();
        this.service.createAdmin(this.token,addData)
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
      }
    }

  }

}
