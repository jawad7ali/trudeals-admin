import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
  animations: [routerTransition()]
})
export class BannersComponent implements OnInit {

  page=1;
  token:any;
  bannerList:any =[];
  filter:any;
  delayTimer;
  pageSize:number;
  currentPage:number;
  maxSize:number;
  totalBanner:number;
  data:any={};
  conformationMessage:string;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) {
    this.currentPage = 1;
		this.pageSize = 12;
		this.maxSize = 10;
   }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let mediaData = {currentPage:this.currentPage,pageSize:this.pageSize}
    this.getBannerList(mediaData);
  }

  // Method to get banner list
  getBannerList(data){
    this.spinner.show();
    this.service.getBannerList(this.token,data)
      .then((result) => {
            let serverResponce:any = result;
            this.bannerList = serverResponce.data.banners;
            this.totalBanner = serverResponce.data.bannerCount;          
            this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status == 404){
            this.bannerList = [];
            // this.toasterService.pop('error', 'Error', error.error.message);  
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }
          // this.toasterService.pop('error', 'Error', error.statusText);
          
      });
  }

  // Method for pagination
	pageChange(currentPage,pageSize){
    // this.data={currentPage:currentPage,pageSize:this.pageSize}
    // this.getBannerList(this.data);
    if(this.filter){
      let mediaData={searchText:this.filter,currentPage:currentPage,pageSize:this.pageSize};
      this.getBannerList(mediaData);
    }else{
      let mediaData = {currentPage:currentPage,pageSize:this.pageSize}
      this.getBannerList(mediaData);
    }
  }

  // Method to search in banner
  searchBanner(){
    if(this.filter){
      clearTimeout(this.delayTimer);
      this.delayTimer = setTimeout(() =>{
        this.data = {searchText:this.filter,currentPage:1,pageSize:this.pageSize}
        this.getBannerList(this.data);  
      },1000)
    }else{
      let mediaData = {currentPage:this.currentPage,pageSize:this.pageSize}
      this.getBannerList(mediaData);
    }
  }

  // Method to activate/Deactivate banner
  activeDeactive(selectedColoum,status){
    if(status == true){
      this.conformationMessage = "You want to hold this banner."
    }else{
      this.conformationMessage = "You want to publish this banner agian."
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
        this.data = {bannerId:selectedColoum.id,isActive:status};  
        this.spinner.show();
        this.service.activeDeactiveBanner(this.token,this.data)
          .then((result) => {
                let serverResponce:any = result;
                
                if(this.filter){
                  let mediaData={searchText:this.filter,currentPage:this.currentPage,pageSize:this.pageSize};
                  this.getBannerList(mediaData);
                }else{
                  let mediaData = {currentPage:this.currentPage,pageSize:this.pageSize}
                  this.getBannerList(mediaData);
                }
                this.spinner.hide();
                swal(
                  'Success',
                  serverResponce.message,
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

  // Method to delete banner
  deleteBanner(banner){
    swal({
      title: 'Are you sure?',
      // text: 'You will not be able to recover this imaginary file!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        let deleteData = {bannerId:banner.id}
        this.service.deleteBanner(this.token,deleteData)
        .then((result) => {
              let serverResponce:any = result;   
              // this.toastr.success(serverResponce.message);      
              this.spinner.hide();
              if(this.filter){
                let mediaData={searchText:this.filter,currentPage:this.currentPage,pageSize:this.pageSize};
                this.getBannerList(mediaData);
              }else{
                let mediaData = {currentPage:this.currentPage,pageSize:this.pageSize}
                this.getBannerList(mediaData);
              }  
                
              swal(
                'Success',
                serverResponce.message,
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

  

}
