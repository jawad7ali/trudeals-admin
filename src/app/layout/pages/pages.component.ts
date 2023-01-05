import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableResource } from 'angular5-data-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  animations: [routerTransition()]
})
export class PagesComponent implements OnInit {

  token:string;
  data:any = {};
  totalPages:number;
  itemCount = 1;
  limits = [10, 20, 40, 80];
  Pages = [];
  currentPage:number;
  pageSize:number;
  filter:any;
  delayTimer:any;
  PagesDetails:any={};
  noDataMessage:string="No data available";
  conformationMessage:string;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,private modalService: NgbModal,public router: Router) {
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let countData={searchText:''};
    this.getPagesCount(countData);
	
	this.currentPage = (0 + 1)/1;
    this.pageSize = 1;
	
	this.getPagesList({currentPage:this.currentPage,pageSize:this.pageSize,searchText:''});
  }

  itemResource = new DataTableResource(this.Pages);

  // Method for dynamic pagination 
  reloadItems(params) {
    // alert("called")
    this.currentPage = (params.offset + params.limit)/params.limit;
    this.pageSize = params.limit;
    // this.data = {currentPage:this.currentPage,pageSize:this.pageSize};
    if(this.filter != undefined){
      this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:this.filter};
    }else{
      this.data = {currentPage:this.currentPage,pageSize:this.pageSize,searchText:''};
    }
    // this.getPagesList(this.data)
    // this.itemResource.query(params).then(items => this.locations = items);
  }

  rowTooltip(item) {
    return item.jobTitle;
  }

  // Service to get news count
  getPagesCount(data){
      this.spinner.show();
      this.service.getPagesCount(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.totalPages = serverResponce.data.pagesCount; 
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }

  // Service to get news list
  getPagesList(data){  
      this.spinner.show();
      this.service.getPagesList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.Pages = serverResponce.data.pagesData;
			  console.log(this.Pages);
              this.itemResource = new DataTableResource(this.Pages);
              this.itemResource.count().then(count => this.itemCount = this.totalPages);
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status == 404){
            this.Pages = [];
            this.toastr.error(error.error.message);
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }
          
      });
  }

  // Method to activate/Deactivate news
  activeDeactive(selectedColoum,status){
    if(status == true){
      this.conformationMessage = "You want to hold this news."
    }else{
      this.conformationMessage = "You want to publish this news agian."
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
        this.data = {newsId:selectedColoum.id,isActive:status};  
        this.spinner.show();
        this.service.activeDeactivePages(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                // this.getPagesCount();
                if(this.filter != undefined){
                  let countData={searchText:this.filter};
                  this.getPagesCount(countData);
                }else{
                  let countData={searchText:''};
                  this.getPagesCount(countData);
                }
                this.data = {currentPage:this.currentPage,pageSize:this.pageSize}
                this.getPagesList(this.data);
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

  // Method to soft delete news
  deletePages(news){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this news',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.data = {newsId:news.id};  
        this.spinner.show();
        this.service.deletePages(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                if(this.filter != undefined){
                  let countData={searchText:this.filter};
                  this.getPagesCount(countData);
                }else{
                  let countData={searchText:''};
                  this.getPagesCount(countData);
                }
                this.data = {currentPage:this.currentPage,pageSize:this.pageSize}
                this.getPagesList(this.data);
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

  // Method to search Pages
  searchPages(){
    if(this.filter){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        let searchData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter};
        this.getPagesList(searchData);
        let countData={searchText:this.filter};
        this.getPagesCount(countData);
      },1000)
    }else{
      this.data = {currentPage:1,pageSize:this.pageSize}
      this.getPagesList(this.data);
      let countData={searchText:''};
      this.getPagesCount(countData);
    }
  }

  // Method for model
  open(content,news) {
    this.PagesDetails = news;
    this.modalService.open(content, { size: 'lg',backdrop:false}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
