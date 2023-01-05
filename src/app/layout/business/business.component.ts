import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableResource } from 'angular5-data-table';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {

  token:string;
  data:any = {};
  totalbusiness:number;
  itemCount = 1;
  limits = [10, 20, 40, 80];
  business = [];
  currentPage:number;
  pageSize:number;
  filter:any;
  delayTimer:any; 

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,private modalService: NgbModal,public router: Router) {
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let countData={searchText:''};
    this.getBusinessCount(countData);
  }

  itemResource = new DataTableResource(this.business);
  
  // Method for dynamic pagination 
  reloadItems(params) {
    this.currentPage = (params.offset + params.limit)/params.limit;
    this.pageSize = params.limit;
    if(this.filter != undefined){
      this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:this.filter};
    }else{
      this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:''};
    }
    this.getBusinessList(this.data)
  }

  rowTooltip(item) {
    return item.jobTitle;
  }

  // Service to get business count
  getBusinessCount(data){
      this.spinner.show();
      this.service.getBusinessCount(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.totalbusiness = serverResponce.data.businessCount;
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }

  // Service to get business list
  getBusinessList(data){
      this.spinner.show();
      this.service.getBusinessList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.business = serverResponce.data.businessList;
              this.itemResource = new DataTableResource(this.business);
              this.itemResource.count().then(count => this.itemCount = this.totalbusiness);
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status == 404){
            this.business = [];
            this.toastr.error(error.error.message);
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }
          
      });
  }

  // Method to search business
  searchBusiness(){
    if(this.filter){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        let searchData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter};
        this.getBusinessList(searchData);
        let countData={searchText:this.filter};
        this.getBusinessCount(countData);
      },1000)
    }else{
      this.data = {currentPage:1,pageSize:this.pageSize}
      this.getBusinessList(this.data);
      let countData={searchText:''};
      this.getBusinessCount(countData);
    }
  }






}
