import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
  animations: [routerTransition()]
})
export class AddLocationComponent implements OnInit {

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  location:any ={geo:{}};
  token:string;
  data:any;
  locationList =[];
  // searchLocation:any;
  searchText:any;
  delayTimer:any;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router,private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    // const queryParams = this.activeRoute.snapshot.queryParams
    let routeParams = this.activeRoute.snapshot.params;
    if(routeParams.id != '' && routeParams.id != 'add'){

      this.data={locationId:routeParams.id}
      this.getLocationById(this.data);
    }
    // this.getLocationList(this.data);
    document.getElementById("location-link").classList.add('router-link-active');
  }

  ngOnDestroy() {
    document.getElementById("location-link").classList.remove('router-link-active');
  }


  // Method to get selected location form google place 
  public handleAddressChange(address) {
    this.location.name = address.address_components[0].long_name;
    this.location.geo.lat = address.geometry.location.lat(); 
    this.location.geo.lng = address.geometry.location.lng();
    this.location.placeId = address.place_id;
  }

  // Method for validation 
  validateLocation(){
    if(this.location.name == undefined || this.location.name == '' ){
      this.toastr.error("Please provide name");
      return false;
    }

    if(this.location.placeId == undefined || this.location.placeId == '' ){
      this.toastr.error("Please select location from dropdown");
      return false;
    }

    if(this.searchText != '' && this.location.locationId == null ){
      this.toastr.error("Please select location from dropdown");
      return false;
    }

    // if(this.location.locationId == undefined || this.location.locationId == ''){
    //   this.toasterService.pop('error', 'Error', 'Please select parent category');
    //   return false;
    // }

    return true;
  }

  // Method for create and update location
  submit(){
    let isValid = this.validateLocation();
    if(isValid){
        // this.location.locationId = this.location.id;
        if(this.location.id){
          this.spinner.show();
          this.service.updateLocation(this.token,this.location)
              .then((result) => {
                  let serverResponce:any = result;
                  this.spinner.hide();
                  this.router.navigate(['/location']);
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
        else{
          this.spinner.show();
          this.service.createLocation(this.token,this.location)
              .then((result) => {
                  let serverResponce:any = result;
                  this.spinner.hide();
                  this.router.navigate(['/location']);
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

  // Method to get location from Id
  getLocationById(data){
    this.spinner.show();
    this.service.getLocationById(this.token,data)
        .then((result) => {
            let serverResponce:any = result;
            this.location = serverResponce.data.locationDetail;
            this.spinner.hide()
          }, (error)=>{
        // this.spinner.hide();
        this.toastr.error("Server not responding.Please try again later.");
    });
  }

  // Method to search location
  searchLocation(){
    if(!this.searchText){
      this.locationList = [];
      this.location.locationId = null;
    }
    if(this.searchText){
      // console.log(this.searchText)
      this.location.locationId = null;
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        let searchData = {searchText:this.searchText};
        this.service.getLocationList(this.token,searchData)
          .then((result) => {
                let serverResponce:any = result;
                this.locationList = serverResponce.data.locations
            }, (error)=>{
              if(error.status == 404){
                this.locationList = [];
                // this.filter.locationSlug = "";
                this.toastr.error(error.error.message);
              }else{
                this.toastr.error("Server not responding.Please try again later");  
              }
                
        });
      },500)
    }
  }

  // Method to get selected location
  selectedLocation(value){
    this.searchText = value.name;
    // this.filter.locationSlug = value.slug;
    this.location.locationId = value.id;
    this.locationList = [];
  }

  // Method to empty location
  closeLocationSuggestion(){
    this.locationList = [];
  }
  

}
