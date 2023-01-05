import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableResource } from 'angular5-data-table';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss'],
  animations: [routerTransition()]
})
export class DealsComponent implements OnInit {
  
  token:string;
  data:any = {};
  totalDeals:number
  deals = [];
  currentPage:number;
  pageSize:number;
  itemCount = 1;
  limits = [10, 20, 40, 80];
  delayTimer:any;
  filter:any={businessId:0,searchText:''};
  businessList:any;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) { }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let countData={searchText:'',businessId:this.filter.businessId};
    this.getDealsCount(countData);
    let ownerData={type:'DEAL'}
    this.getBusinessList(ownerData);
  }

  itemResource = new DataTableResource(this.deals);

  // Method for dynamic pagination 
  reloadItems(params) {
    this.currentPage = (params.offset + params.limit)/params.limit;
    this.pageSize = params.limit;

    if(this.filter.searchText != ''){
      this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:this.filter.searchText,businessId:this.filter.businessId};
    }else{
      this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:'',businessId:this.filter.businessId};
    }
    this.getDealsList(this.data)
  }

  // Service to get deals count
  getDealsCount(data){
      this.spinner.show();
      this.service.getDealsCount(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.totalDeals = serverResponce.data.dealsCount;
              this.spinner.hide();
          }, (error)=>{
          this.totalDeals = 0;
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }

  // Service to get deals list
  getDealsList(data){
      this.spinner.show();
      this.service.getDealsList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.deals = serverResponce.data.dealsList;              
              this.itemResource = new DataTableResource(this.deals);
              this.itemResource.count().then(count => this.itemCount = this.totalDeals);  
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status != 404){
            this.toastr.error("Server not responding.Please try again later.");  
          }
      });
  }

  // Method to search deals
  searchDeal(){
    if(this.filter){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        let searchData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter.searchText,businessId:this.filter.businessId};
        this.getDealsList(searchData);
        let countData={searchText:this.filter.searchText,businessId:this.filter.businessId};
        this.getDealsCount(countData);
      },1000)
    }else{
      this.data = {currentPage:1,pageSize:this.pageSize}
      this.getDealsList(this.data);
      let countData={searchText:'',businessId:this.filter.businessId};
      this.getDealsCount(countData);
    }
  }

  // Method to activate/Deactivate deal
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
        this.data = {dealId:selectedColoum.dealId,businessId:selectedColoum.businessId,isActive:status};  
        this.spinner.show();
        this.service.activeDeactiveDeal(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                
                let filterData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter.searchText,businessId:this.filter.businessId};
                this.getDealsList(filterData);
                if(this.filter.searchText != ''){
                  let countData={searchText:this.filter.searchText,businessId:this.filter.businessId};
                  this.getDealsCount(countData);
                }else{
                  let countData={searchText:'',businessId:this.filter.businessId};  
                  this.getDealsCount(countData);
                }
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
              swal(
                'Cancelled',
                error.error.message,
                'error'
              )
              // this.toastr.error(error.error.message);
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

  // Service to get location list
  getBusinessList(data){
      this.spinner.show();
      this.service.getOwnerList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.businessList = serverResponce.data.memberList;
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status != 404){
            this.toastr.error("Server not responding.Please try again later.");
          }
          
      });
  }

  // Method if business name is changes
  businessOwner(owner){
    let filterData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter.searchText,businessId:this.filter.businessId};
    this.getDealsList(filterData);
    if(this.filter.searchText != ''){
      let countData={searchText:this.filter.searchText,businessId:this.filter.businessId};
      this.getDealsCount(countData);
    }else{
      let countData={searchText:'',businessId:this.filter.businessId};  
      this.getDealsCount(countData);
    }
    
  }

  // Method to delete deals
  deleteDeals(deal){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this news',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.data = {dealId:deal.dealId,businessId:deal.businessId};  
        this.spinner.show();
        this.service.deleteDeal(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                let filterData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter.searchText,businessId:this.filter.businessId};
                this.getDealsList(filterData);
                if(this.filter.searchText != ''){
                  let countData={searchText:this.filter.searchText,businessId:this.filter.businessId};
                  this.getDealsCount(countData);
                }else{
                  let countData={searchText:'',businessId:this.filter.businessId};  
                  this.getDealsCount(countData);
                }
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
              swal(
                'Cancelled',
                error.error.message,
                'error'
              )
              // this.toastr.error(error.error.message);
            }else{
              this.toastr.error("Server not responding.Please try again later.");
            }
            // this.toastr.error("Server not responding.Please try again later.");
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

}
