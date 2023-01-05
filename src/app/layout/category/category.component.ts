import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { DataTableResource } from 'angular5-data-table';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  animations: [routerTransition()]
})
export class CategoryComponent implements OnInit {

  token:string;
  data:any = {};
  totalCategory:number
  categories = [];
  currentPage:number;
  pageSize:number;
  itemCount = 1;
  limits = [10, 20, 40, 80];
  delayTimer:any;
  filter:any;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) {
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let countData={searchText:''};
    this.getCategoryCount(countData);
    // this.data = {currentPage:1,pageSize:10}
    // this.getCategoryList(this.data);  
  }
     
    itemResource = new DataTableResource(this.categories);
            
    // Method for dynamic pagination 
    reloadItems(params) {
      this.currentPage = (params.offset + params.limit)/params.limit;
      this.pageSize = params.limit;
      // this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:this.filter};
      if(this.filter != undefined){
        this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:this.filter};
      }else{
        this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:''};
      }
      this.getCategoryList(this.data)
     
    }


  // Service to get category count
  getCategoryCount(data){
      this.spinner.show();
      this.service.getCategoryCount(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              // console.log(serverResponce,'serverResponce');
              this.totalCategory = serverResponce.data.categoryCount;
              this.spinner.hide();
          }, (error)=>{
          // console.log('dsf',error);
          this.spinner.hide();
          this.totalCategory = 0;
          this.toastr.error("Server not responding.Please try again later.");
      });
  }


  // Service to get category list
  getCategoryList(data){
      this.spinner.show();
      this.service.getCategoryList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.categories = serverResponce.data.categories;              
              this.itemResource = new DataTableResource(this.categories);
              this.itemResource.count().then(count => this.itemCount = this.totalCategory);  
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status != 404){
            this.toastr.error("Server not responding.Please try again later.");  
          }
      });
  }


  // Method to activate/Deactivate category
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
        this.data = {categoryId:selectedColoum.id,isActive:status};  
        this.spinner.show();
        this.service.activeDeactiveCategory(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                
                if(this.filter != undefined){
                  let countData={searchText:this.filter};
                  this.getCategoryCount(countData);
                }else{
                  let countData={searchText:''};
                  this.getCategoryCount(countData);
                }
                
                this.data = {currentPage:this.currentPage,pageSize:this.pageSize}
                this.getCategoryList(this.data);
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

  // Method to search category
  searchCategory(){
    if(this.filter){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        let searchData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter};
        this.getCategoryList(searchData);
        let countData={searchText:this.filter};
        this.getCategoryCount(countData);
      },1000)
    }else{
      this.data = {currentPage:1,pageSize:this.pageSize}
      this.getCategoryList(this.data);
      let countData={searchText:''};
      this.getCategoryCount(countData);
    }
  }


}
