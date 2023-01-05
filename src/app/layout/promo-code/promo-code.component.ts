import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableResource } from 'angular5-data-table';
import { ApiService } from '../../api.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.scss']
})
export class PromoCodeComponent implements OnInit {

  token:string;
  data:any = {};
  totalPromoCode:number;
  itemCount = 1;
  limits = [10, 20, 40, 80];
  PromoCodes = [];
  currentPage:number;
  pageSize:number;
  filter:any;
  delayTimer:any;
  noDataMessage:string="No data available";
  conformationMessage:string;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) { }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let countData={searchText:''};
    this.getPromoCodeCount(countData);
  }

  itemResource = new DataTableResource(this.PromoCodes);

  // Method for dynamic pagination 
  reloadItems(params) {
    
    this.currentPage = (params.offset + params.limit)/params.limit;
    this.pageSize = params.limit;
    // this.data = {currentPage:this.currentPage,pageSize:this.pageSize};
    if(this.filter != undefined){
      this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:this.filter};
    }else{
      this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:''};
    }
    this.getPromoCodeList(this.data)
    // this.itemResource.query(params).then(items => this.locations = items);
  }

  // Service to get promo code count
  getPromoCodeCount(data){
    this.spinner.show();
    this.service.getPromoCodeCount(this.token,data)
      .then((result) => {
            let serverResponce:any = result;
            this.totalPromoCode = serverResponce.data.promocodesCount;
            this.spinner.hide();
        }, (error)=>{
        this.spinner.hide();
        this.toastr.error("Server not responding.Please try again later.");
    });
  }

  // Service to get promo code list
  getPromoCodeList(data){
      this.spinner.show();
      this.service.getPromoCodeList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.PromoCodes = serverResponce.data.promocodesList;
              this.itemResource = new DataTableResource(this.PromoCodes);
              this.itemResource.count().then(count => this.itemCount = this.totalPromoCode);
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status == 404){
            this.PromoCodes = [];
            this.toastr.error(error.error.message);
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }
          
      });
  }

  // Method to search promo code
  searchPromoCode(){
    if(this.filter){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        let searchData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter};
        this.getPromoCodeList(searchData);
        let countData={searchText:this.filter};
        this.getPromoCodeCount(countData);
      },1000)
    }else{
      this.data = {currentPage:1,pageSize:this.pageSize}
      this.getPromoCodeList(this.data);
      let countData={searchText:''};
      this.getPromoCodeCount(countData);
    }
  }

  
  // Method to activate/Deactivate promo code
  activeDeactive(selectedColoum,status){
    if(status == true){
      this.conformationMessage = "You want to hold this promo code."
    }else{
      this.conformationMessage = "You want to publish this promo code agian."
    }
    swal({
      title: 'Are you sure?',
      text: this.conformationMessage,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.data = {id:selectedColoum.id,isActive:status};  
        this.spinner.show();
        this.service.activeDeactivePromoCode(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                // this.getNewsCount();
                if(this.filter != undefined){
                  let countData={searchText:this.filter};
                  this.getPromoCodeCount(countData);
                }else{
                  let countData={searchText:''};
                  this.getPromoCodeCount(countData);
                }
                this.data = {currentPage:this.currentPage,pageSize:this.pageSize}
                this.getPromoCodeList(this.data);
                this.spinner.hide();
                swal(
                  'Success',
                  '',
                  'success'
                )
                // this.toasterService.pop('success', 'success', serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            this.toastr.error("Server not responding.Please try again later.");
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

  // Method to soft delete promocode
  deletePromoCode(promocode){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this promo code',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.data = {id:promocode.id};  
        this.spinner.show();
        this.service.deletePromoCode(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                if(this.filter != undefined){
                  let countData={searchText:this.filter};
                  this.getPromoCodeCount(countData);
                }else{
                  let countData={searchText:''};
                  this.getPromoCodeCount(countData);
                }
                this.data = {currentPage:this.currentPage,pageSize:this.pageSize}
                this.getPromoCodeList(this.data);
                this.spinner.hide();
                swal(
                  'Success',
                  '',
                  'success'
                )
                // this.toasterService.pop('success', 'success', serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            this.toastr.error("Server not responding.Please try again later.");
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
