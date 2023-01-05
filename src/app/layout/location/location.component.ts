import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { DataTableResource } from 'angular5-data-table';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  animations: [routerTransition()]
})
export class LocationComponent implements OnInit {

  token:string;
  data:any = {};
  totalLocation:number;
  itemCount = 1;
  limits = [10, 20, 40, 80];
  locations = [];
  currentPage:number;
  pageSize:number;
  filter:any;
  delayTimer:any;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) {
  }

   ngOnInit() {
      this.token = localStorage.getItem('auth-token');
      if(this.token == null){
          this.router.navigate(['/login']);
      }
      let countData={searchText:''};
      this.getLocationCount(countData);
      // this.data = {currentPage:1,pageSize:10}
      // this.getLocationList(this.data); 
    }

    
    itemResource = new DataTableResource(this.locations);
          

    // Method for dynamic pagination 
    reloadItems(params) {
      // alert("called")
      this.currentPage = (params.offset + params.limit)/params.limit;
      this.pageSize = params.limit;
      if(this.filter != undefined){
        this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:this.filter};
      }else{
        this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:''};
      }
      
      this.getLocationList(this.data)
      // this.itemResource.query(params).then(items => this.locations = items);
    }


    rowTooltip(item) {
      return item.jobTitle;
    }

  
  // Service to get location count
  getLocationCount(data){
      this.spinner.show();
      this.service.getLocationCount(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.totalLocation = serverResponce.data.locationCount;
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }
  
  
  // Service to get location list
  getLocationList(data){
      this.spinner.show();
      this.service.getLocationList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.locations = serverResponce.data.locations;
              // console.log(serverResponce,'>>>>>>>>>>>>>>>>>>>>>>>>> serverResponce >>>>>>>>>>>>>>>>>');
              this.itemResource = new DataTableResource(this.locations);
              this.itemResource.count().then(count => this.itemCount = this.totalLocation);
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }

  // Method to activate/Deactivate location
  activeDeactive(selectedColoum,status){
    swal({
      title: 'Are you sure?',
      // text: 'You will not be able to recover this imaginary file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.data = {locationId:selectedColoum.id,isActive:status};  
      this.spinner.show();
        this.service.activeDeactiveLocation(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                // console.log(serverResponce,'>>>>>>>>>>>>>>>>>>>>>>>>> serverResponce >>>>>>>>>>>>>>>>>');
                if(this.filter != undefined){
                  let countData={searchText:this.filter};
                  this.getLocationCount(countData);
                }else{
                  let countData={searchText:''};
                  this.getLocationCount(countData);
                }
                
                this.data = {currentPage:this.currentPage,pageSize:this.pageSize}
                this.getLocationList(this.data);
                this.spinner.hide();
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

  // Method to search Location
  searchLocation(){
    if(this.filter){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        let searchData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter};
        this.getLocationList(searchData);
        let countData={searchText:this.filter};
        this.getLocationCount(countData);
      },1000)
    }else{
      this.data = {currentPage:1,pageSize:this.pageSize}
      this.getLocationList(this.data);
      let countData={searchText:''};
      this.getLocationCount(countData);
    }
  }
  



}
