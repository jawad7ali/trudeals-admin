import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
declare var $: any

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  animations: [routerTransition()]
})
export class FAQComponent implements OnInit {

  token:any;
  data:any={};
  faq:any={};
  pageSize:number;
  currentPage:number;
  maxSize:number;
  faqList:any =[];
  totalFaq:number

  constructor(private modalService: NgbModal,public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router,private activeRoute: ActivatedRoute) { 
    this.currentPage = 1;
		this.pageSize = 10;
		this.maxSize = 10;
  }
  // closeResult: string;

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    let faqData = {currentPage:this.currentPage,pageSize:this.pageSize}
    this.getFaqList(faqData);
  }

  // Method to get faq list
  getFaqList(data){
    this.spinner.show();
    this.service.getFaqList(this.token,data)
      .then((result) => {
            let serverResponce:any = result;
            this.faqList = serverResponce.data.FAQ;
            this.totalFaq = serverResponce.data.totalCount;
            this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status == 404){
            this.faqList = [];
            // this.toasterService.pop('error', 'Error', error.error.message);  
          }else{
            this.toastr.error("Server not responding.Please try again later.");
          }
          // this.toasterService.pop('error', 'Error', error.statusText);

      });
  }

  // Method for pagination
	pageChange(currentPage,pageSize){
    this.data={currentPage:currentPage,pageSize:this.pageSize}
    this.getFaqList(this.data);
  }

  // Method to open model
  open(content,faq) {
    if(faq != undefined){
      this.faq = Object.assign({}, faq);
    }
    this.modalService.open(content, {}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  //Nabila code for Add question
  openAddQuestion(content){
      this.faq = Object.assign({}, {});

      this.modalService.open(content, {}).result.then((result) => {
          // this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
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

  // Method to validate faq
  validateFaq(){

    if(this.faq.question == undefined || this.faq.question == ''){
      this.toastr.error("Please provide question");
      return false;
    }

    if(this.trimWhiteSpace(this.faq.question)){
      this.toastr.error("Please provide question");
      return false;
    }

    if(this.faq.answer == undefined || this.faq.answer == ''){
      this.toastr.error("Please provide answer");
      return false;
    }

    if(this.trimWhiteSpace(this.faq.answer)){
      this.toastr.error("Please provide answer");
      return false;
    }

    return true;

  }
  
  // Method to create and update faq 
  submit(){
    let isValid = this.validateFaq()
    if(isValid){
      this.spinner.show();
      this.service.createOrUpdateFAQ(this.token,this.faq)
      .then((result) => {
            let serverResponce:any = result;
            this.toastr.success(serverResponce.message);          
            this.spinner.hide();
            $( ".close" ).trigger( "click" );
            let faqData = {currentPage:1,pageSize:this.pageSize}
            this.getFaqList(faqData);
          }, (error)=>{
          this.spinner.hide();
          if(error.error.status == 409 || error.status == 404 ){
            this.toastr.error(error.error.message);
          }else{
            this.toastr.error("Server not responding. Please try after sometime.");
          }
                    
      });
    }  
  }

  // Method to delete faq
  deleteFaq(faq){
    swal({
      title: 'Are you sure?',
      text: 'you want to delete this question and answer',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        let deleteData = {id:faq.id}
        this.service.deleteFaq(this.token,deleteData)
        .then((result) => {
              let serverResponce:any = result;   
              // this.toastr.success(serverResponce.message);      
              this.spinner.hide();
              let faqData = {currentPage:this.currentPage,pageSize:this.pageSize}
              this.getFaqList(faqData);    
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
          'question and answer not deleted',
          'error'
        )
      }
    })
  }

  

}
