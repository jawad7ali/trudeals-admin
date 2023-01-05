import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-member-ship-edit',
  templateUrl: './member-ship-edit.component.html',
  styleUrls: ['./member-ship-edit.component.scss']
})
export class MemberShipEditComponent implements OnInit {

  token:string;
  memberShip:any={};
  data:any={};

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router,private activeRoute: ActivatedRoute) { 
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let routeParams = this.activeRoute.snapshot.params;
    if(routeParams.id != ''){
      this.data={id:routeParams.id}
      this.getMemberShipById(this.data);
    }
    document.getElementById("member-link").classList.add('router-link-active');
  }

  ngOnDestroy() {
    document.getElementById("member-link").classList.remove('router-link-active');
  }

    // Method to get membership from Id
    getMemberShipById(data){
      this.spinner.show();
      this.service.getMemberShipById(this.token,data)
          .then((result) => {
              let serverResponce:any = result;
              this.memberShip = serverResponce.data.memberShipDetails;
              this.spinner.hide()
            }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
    }

    // Method to trim white space
    trimWhiteSpace(test){
      let trim = test.toString().trim();
      if(trim == ''){
        return true;
      }else{
        return false;
      }
    }

    // Method to check if number
    isNumber(value) {
        let re = new RegExp("^[+-]?(?:[0-9]{0,9}\.[0-9]{1,9}|[0-9])$");
        if (re.test(value))
        {
            return true;
        } else
        {
            return false;
        }
    }

  // Method to validate
  validateMemberShip(){

    if(this.memberShip.value == undefined || this.memberShip.value == ''){
      this.toastr.error("Please provide price");
      return false;
    }

    if(this.memberShip.value != undefined && this.memberShip.value != '' && this.trimWhiteSpace(this.memberShip.value)){
      this.toastr.error("Please provide price");
      return false;
    }

    if(this.memberShip.value != undefined && this.memberShip.value != '' && !this.isNumber(this.memberShip.value)){
      this.toastr.error("Please provide valid price");
      return false;
    }

    if(this.memberShip.description == undefined || this.memberShip.description == ''){
      this.toastr.error("Please provide description");
      return false;
    }

    if(this.memberShip.description != undefined && this.memberShip.description != '' && this.trimWhiteSpace(this.memberShip.description)){
      this.toastr.error("Please provide description");
      return false;
    }

    return true;
  }


  // Final submit method
  submit(){
    let valid = this.validateMemberShip();
    if(valid){
        this.spinner.show();
        this.service.updateMemberShip(this.token,this.memberShip)
            .then((result) => {
                let serverResponce:any = result;
                this.spinner.hide();
                this.router.navigate(['/member-ship']);
                this.toastr.success(serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            if(error.status == 400 || error.status == 409){
              this.toastr.error(error.error.message);
            }else{
              this.toastr.error("Server not responding.Please try again later.");
            }
        });      
    }    
  }

}
