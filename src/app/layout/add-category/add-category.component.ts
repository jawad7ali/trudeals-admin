import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Observable'
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  animations: [routerTransition()]
})
export class AddCategoryComponent implements OnInit {

  category:any = {name:'',imageUrl:''};
  token:string;
  event = "category";
  data:any;
  
  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,private modalService: NgbModal,public router: Router,private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let routeParams = this.activeRoute.snapshot.params;
    if(routeParams.id != '' && routeParams.id != 'add'){
      this.data={categoryId:routeParams.id}
      this.getCategoryById(this.data);
    }
    document.getElementById("category-link").classList.add('router-link-active');
  }

  ngOnDestroy() {
    document.getElementById("category-link").classList.remove('router-link-active');
  }


  // Method to catch event for image
  receiveMessage($event){
    this.category.imageUrl = $event;
  }

  // Method to trim white space
  trimWhiteSpace(value){
    let trim = value.trim()
    if(trim == ''){
      return true;
    }else{
      return false;
    }
  }

  validateCategory(){
    if(this.category.name == undefined || this.category.name == ''){
      this.toastr.error("Please provide name");
      return false;
    }

    if(this.trimWhiteSpace(this.category.name)){
      this.toastr.error("Please provide name");
      return false;
    }

    if(this.category.imageUrl == undefined || this.category.imageUrl == ''){
      this.toastr.error("Please upload category image");
      return false;
    }
    return true;
  }

  // Final submit method
  submit(){
    let valid = this.validateCategory();
    if(valid){
      if(this.category.id){
        this.data = {categoryId:this.category.id ,name:this.category.name,imageUrl:this.category.imageUrl }
        this.spinner.show();
        this.service.updateCategory(this.token,this.data)
            .then((result) => {
                let serverResponce:any = result;
                // this.eventMessage.emit(this.imageURL);
                this.spinner.hide();
                this.router.navigate(['/category']);
                this.toastr.success(serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            if(error.status == 400 || error.status == 409){
              this.toastr.error(error.error.message);
            }else{
              this.toastr.error("Server not responding.Please try again later.");
            }
        });  
      }else{
        this.data = {name:this.category.name,imageUrl:this.category.imageUrl }
        this.spinner.show();
        this.service.createCategory(this.token,this.data)
            .then((result) => {
                let serverResponce:any = result;
                // this.eventMessage.emit(this.imageURL);
                this.spinner.hide();
                this.router.navigate(['/category']);
                this.toastr.success(serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            if(error.status == 400 || error.status == 409){
              this.toastr.error(error.error.message);
            }else{
              this.toastr.error("Server not responding.Please try again later.");
            }
        });
      }
      
    }    
  }


  // Method to get category from Id
  getCategoryById(data){
    this.spinner.show();
    this.service.getCategoryById(this.token,data)
        .then((result) => {
            let serverResponce:any = result;
            this.category = serverResponce.data.categoryDetail;
            this.spinner.hide()
          }, (error)=>{
        this.spinner.hide();
        this.toastr.error("Server not responding.Please try again later.");
    });
  }

  // Method to remove selected image
  removeImage(){
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this image',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.category.imageUrl = '';
        swal(
          'Success',
          '',
          'success'
        )
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
