import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['./qa.component.scss']
})
export class QaComponent implements OnInit {

  QnA:any={};
  ckEditorConfig:any={};
  token:string;
  data:any;
  description:string;

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router,private activeRoute: ActivatedRoute) { 
      this.ckEditorConfig = {
        height: 200,
        language: "en",
        allowedContent: true,           
        "toolbarGroups": [
              { name: 'basicstyles', "groups" : [ 'Bold','Italic','Strike','-','RemoveFormat' ] },
              { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align' ] },
              { name: 'links', "groups" : [ 'Link','Unlink','Anchor' ] },
              { name: 'styles', "groups" : [ 'Styles','Format','Font','FontSize' ] },
              { name: 'colors', "groups" : [ 'TextColor','BGColor' ] },
          ],
          "removeButtons":"Source,Save,Templates,Find,Replace,Scayt,SelectAll,forms,document"

    };
  }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
    this.getQnADetails();
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

  // Method to remove html tag
  removeHTMLTag(content){
    var plainText = content.replace(/<[^>]*>/g, '');
    if(this.trimWhiteSpace(plainText)){
      return true;
    }else{
      return false;
    }
  }

  // Method to validate QnA
  validateQnA(){
    if(this.description == undefined || this.description == ''){
      this.toastr.error("Please provide description");
      return false;
    }

    if(this.description != undefined && this.description != '' && this.removeHTMLTag(this.description)){
      this.toastr.error("Please provide description");
      return false;
    }
    return true; 
  }

  // Method for final submit
  submit(){
      let isValid = this.validateQnA();
      if(isValid){
        this.spinner.show();
        if(this.QnA != null){
          this.data = {description :this.description,id:this.QnA.id}
        }else{
          this.data = {description :this.description}
        }
        this.service.updateQnA(this.token,this.data)
            .then((result) => {
                let serverResponce:any = result;
                this.spinner.hide();
                // this.router.navigate(['/news']);
                this.getQnADetails();
                this.toastr.success(serverResponce.message);
            }, (error)=>{
            this.spinner.hide();
            if(error.status == 409){
              this.toastr.error(error.error.message);
            }else{
              this.toastr.error("Server not responding.Please try again later.");
            }
        });
      }
  }

  // Method to get QnA
  getQnADetails(){
    this.spinner.show();
    this.service.getQnADetails(this.token)
        .then((result) => {
            let serverResponce:any = result;
            this.QnA = serverResponce.data.qa;
            if(this.QnA != null){
              this.description = serverResponce.data.qa.description;
            }
            this.spinner.hide()
          }, (error)=>{
        this.spinner.hide();
        this.toastr.error("Server not responding.Please try again later.");
    });
  }

}
