import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableResource } from 'angular5-data-table';
import swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    // page =1;
    token:string;
    data:any = {};
    totalUsers:number;
    itemCount = 1;
    limits = [10, 20, 40, 80];
    usersList = [];
    adminList =[];
    currentPage:number;
    pageSize:number;
    filter:any={accountType:'BUSINESS',searchText:''};
    delayTimer:any;

    constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) { 
    }

    ngOnInit() {
      this.token = localStorage.getItem('auth-token');
      if(this.token == null){
          this.router.navigate(['/login']);
      }
      let countData={searchText:'',accountType:this.filter.accountType};
      this.getUsersCount(countData);
    }

    itemResource = new DataTableResource(this.usersList);

    // Method for dynamic pagination 
    reloadItems(params) {
      this.currentPage = (params.offset + params.limit)/params.limit;
      this.pageSize = params.limit;
      // this.data = {currentPage:this.currentPage,pageSize:this.pageSize,accountType:this.filter.accountType,searchText:this.filter.searchText};
      if(this.filter != undefined){
        this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:this.filter.searchText,accountType:this.filter.accountType};
      }else{
        this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:''};
      }
      this.getUsersList(this.data)
      // this.itemResource.query(params).then(items => this.locations = items);
    }

    rowTooltip(item) {
      return item.jobTitle;
    }

    // Service to get location count
    getUsersCount(data){
      this.spinner.show();
      this.service.getUsersCount(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.totalUsers = serverResponce.data.memberCount;
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }


  // Service to get location list
  getUsersList(data){
      this.spinner.show();
      this.service.getUsersList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.usersList = serverResponce.data.userList;
              // console.log(this.usersList,'this.usersList');
              this.itemResource = new DataTableResource(this.usersList);
              this.itemResource.count().then(count => this.itemCount = this.totalUsers);
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }

  // Method to activate/Deactivate users
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
        this.data = {userId:selectedColoum.id,isActive:status};  
        this.spinner.show();
        this.service.activeDeactiveUser(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                if(this.filter != undefined){
                  let countData={searchText:this.filter.searchText,accountType:this.filter.accountType};
                  this.getUsersCount(countData);
                }else{
                  let countData={searchText:'',accountType:this.filter.accountType};
                  this.getUsersCount(countData);
                }
                
                this.data = {currentPage:this.currentPage,pageSize:this.pageSize,accountType:this.filter.accountType,searchText:this.filter.searchText}
                this.getUsersList(this.data);
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

  // Method to search users
  searchUsers(){
    if(this.filter.searchText != ''){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        let searchData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter.searchText,accountType:this.filter.accountType};
        this.getUsersList(searchData);
        let countData={searchText:this.filter.searchText,accountType:this.filter.accountType};
        this.getUsersCount(countData);
      },1000)
    }else{
      this.data = {currentPage:1,pageSize:this.pageSize,accountType:this.filter.accountType,searchText:this.filter.searchText}
      this.getUsersList(this.data);
      let countData={searchText:'',accountType:this.filter.accountType};
      this.getUsersCount(countData);
    }
  }

  // Method if account type is changes
  accountTypeSelected(type){
    let filterData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter.searchText,accountType:type};
    this.getUsersList(filterData);
    if(this.filter.searchText != ''){
      let countData={searchText:this.filter.searchText,accountType:this.filter.accountType};
      this.getUsersCount(countData);
    }else{
      let countData={searchText:'',accountType:this.filter.accountType};  
      this.getUsersCount(countData);
    }
    
  }


}
