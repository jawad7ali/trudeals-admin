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
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  animations: [routerTransition()]
})
export class NewsComponent implements OnInit {

  token:string;
  data:any = {};
  totalNews:number;
  itemCount = 1;
  limits = [10, 20, 40, 80];
  News = [];
  currentPage:number;
  pageSize:number;
  filter:any;
  delayTimer:any;
  newsDetails:any={};
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
    this.getNewsCount(countData);
  }

  itemResource = new DataTableResource(this.News);

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
    this.getNewList(this.data)
    // this.itemResource.query(params).then(items => this.locations = items);
  }

  rowTooltip(item) {
    return item.jobTitle;
  }

  // Service to get news count
  getNewsCount(data){
      this.spinner.show();
      this.service.getNewsCount(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.totalNews = serverResponce.data.newsCount;
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }

  // Service to get news list
  getNewList(data){
      this.spinner.show();
      this.service.getNewList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              this.News = serverResponce.data.newsList;
              this.itemResource = new DataTableResource(this.News);
              this.itemResource.count().then(count => this.itemCount = this.totalNews);
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status == 404){
            this.News = [];
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
        this.service.activeDeactiveNews(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                // this.getNewsCount();
                if(this.filter != undefined){
                  let countData={searchText:this.filter};
                  this.getNewsCount(countData);
                }else{
                  let countData={searchText:''};
                  this.getNewsCount(countData);
                }
                this.data = {currentPage:this.currentPage,pageSize:this.pageSize}
                this.getNewList(this.data);
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
  deleteNews(news){
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
        this.service.deleteNews(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                if(this.filter != undefined){
                  let countData={searchText:this.filter};
                  this.getNewsCount(countData);
                }else{
                  let countData={searchText:''};
                  this.getNewsCount(countData);
                }
                this.data = {currentPage:this.currentPage,pageSize:this.pageSize}
                this.getNewList(this.data);
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

  // Method to search News
  searchNews(){
    if(this.filter){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        let searchData = {currentPage:1,pageSize:this.pageSize,searchText:this.filter};
        this.getNewList(searchData);
        let countData={searchText:this.filter};
        this.getNewsCount(countData);
      },1000)
    }else{
      this.data = {currentPage:1,pageSize:this.pageSize}
      this.getNewList(this.data);
      let countData={searchText:''};
      this.getNewsCount(countData);
    }
  }

  // Method for model
  open(content,news) {
    this.newsDetails = news;
    this.modalService.open(content, { size: 'lg',backdrop:false}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
