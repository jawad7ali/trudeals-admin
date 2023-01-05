import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-media-selection',
  templateUrl: './media-selection.component.html',
  styleUrls: ['./media-selection.component.scss']
})
export class MediaSelectionComponent implements OnInit {

  token:string;
  data:any;
  galleryImages:any;
  selectedImage:any;
  @Input() profile:any;
  @Output() imageSelected = new EventEmitter<string>();
  filter:string;
  cityId:number;
  eventType:any;
  currentPage:number = 1;
  pageSize:number= 50;
  
  constructor(private modalService: NgbModal,public router: Router, public service: ApiService,private spinner: NgxSpinnerService,private toastr: ToastrService) { }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    this.getImageList(this.data);
  }

  // Service to get image list
  getImageList(data){
      // this.spinner.show();
      this.service.getImageList(this.token,data)
        .then((result) => {
              let serverResponce:any = result;
              // console.log(serverResponce,'serverResponce');
              this.galleryImages = serverResponce.data.galleryImages;
              // console.log(this.galleryImages,'this.galleryImages');
              // this.spinner.hide();
          }, (error)=>{
            this.galleryImages = [];  
          // this.spinner.hide();
          if(error.error.status != 404){
            this.toastr.error("Server not responding.Please try again later.");
          }
          
      });
  }

  // Method to open model
  open(content,profile) {
    if(profile.cityId == ''){
      this.toastr.error("Please select the city first.");
    }else{
      // profile.cityId = parseInt(profile.cityId);
      this.cityId = profile.cityId;
      this.eventType = profile.event;
      let galleryData = {type:this.eventType,cityId:this.cityId,pageSize:this.pageSize,currentPage:this.currentPage};
      this.getImageList(galleryData);
    }
    
    if(profile.image != ''){
      this.selectedImage = profile.image;
    }
    
    this.modalService.open(content, {size: 'lg',backdrop:false}).result.then((result) => {
      this.imageSelected.emit(this.selectedImage);
      this.selectedImage = '';
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // alert("called 2");
      if(this.selectedImage == undefined || this.selectedImage == ''){
        this.toastr.error("Image not selected");
      }
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // Method to search in gallery
  searchGallery(search){
    this.data = {searchText:search,type:this.eventType,cityId:this.cityId,pageSize:this.pageSize,currentPage:this.currentPage}
    this.getImageList(this.data);
  }







}
