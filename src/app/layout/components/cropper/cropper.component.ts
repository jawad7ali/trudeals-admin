import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../api.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  closeResult: string;
  data:any;
  token:string;
  signedURL:string;
  imageURL:string;
  // new:any;
  
  @Input() event:string;
  @Output() eventMessage = new EventEmitter<string>();
  
    constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,private modalService: NgbModal,private ngZoneService: NgZone) { }

    ngOnInit() {
      this.token = localStorage.getItem('auth-token');
      //  this.toDataURL('https://dnkwg6g8y3nyo.cloudfront.net/f24o7jlw0qf6p.png')
      //   .then(dataUrl => {
      //     console.log('RESULT:', dataUrl)
      //   })
        
      // this.toDataUrl('https://dnkwg6g8y3nyo.cloudfront.net/f2if1jlwgy5wb.png', function(myBase64) {
      //       console.log(myBase64); // myBase64 is the base64 string
      //   });

      

    }
    
    


    // testingRatio:string = "16 / 9";
    


    // Method if image is selected
    fileChangeEvent(event: any): void {  
      this.imageChangedEvent = event;
    }
  
    
    // convert base64/URLEncoded data component to raw binary data held in a string
    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        let byteString = atob(dataURI.split(',')[1]);
      
        // separate out the mime component
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      
        // write the bytes of the string to an ArrayBuffer
        let ab = new ArrayBuffer(byteString.length);
      
        // create a view into the buffer
        let ia = new Uint8Array(ab);
      
        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
      
        // write the ArrayBuffer to a blob, and you're done
        let blob = new Blob([ab], {type: mimeString});
        return blob;
    }

    // Method for cropper if image is copped
    imageCropped(image: string) {
        this.croppedImage = image;
    }


    imageLoaded() {  
      // show cropper
    }

    // Method for error message if wrong formate of image is selected
    loadImageFailed() {
        // show message
    }

    open(content,test) {
      this.modalService.open(content, {size: 'lg'}).result.then((result) => {
        // this.closeResult = `Closed with: ${result}`;
        // alert("model called 1");
      }, (reason) => {
        // alert("model called 2");
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  
    // Method to get signed url for S3 Bucket
    submit(){
        this.ngZoneService.runOutsideAngular(()=>{
          let blob = this.dataURItoBlob(this.croppedImage);
          if(blob.type != 'image/jpeg' && blob.type != 'image/png'){
            this.toastr.error("Please upload .png/.jpeg image only");
          }else{
            this.data = {contentType: blob.type,type:'CATEGORY'}
            this.spinner.show();
              this.service.getSignedUrl(this.token,this.data)
                .then((result) => {
                      let serverResponce:any = result;
                      this.signedURL = serverResponce.data.signedURL;
                      this.imageURL = serverResponce.data.imageUrl;
                      this.S3upload(this.signedURL, blob);
                      // this.spinner.hide();
                  }, (error)=>{
                  this.spinner.hide();
                  this.toastr.error(error.statusText);
              });  
          }
        })      
    }

    // Method to upload image in S3 Bucket
    S3upload(URL,data){
      // this.ngZoneService.runOutsideAngular(()=>{
        this.spinner.show();
        this.service.S3upload(URL,data)
            .then((result) => {
                let serverResponce:any = result;
                console.log(serverResponce,'serverResponce');
                this.eventMessage.emit(this.imageURL);
                this.blankVariable();
                $( ".close" ).trigger( "click" );
                this.spinner.hide();
            }, (error)=>{
            this.spinner.hide();
            this.toastr.error(error.statusText);
        });  
      // })
    }


    // toDataURL(url, callback) {
    //   var xhr = new XMLHttpRequest();
    //   xhr.onload = function() {
    //     var reader = new FileReader();
    //     reader.onloadend = function() {
    //       callback(reader.result);
    //     }
    //     reader.readAsDataURL(xhr.response);
    //   };
    //   xhr.open('GET', url);
    //   xhr.responseType = 'blob';
    //   xhr.send();
    // }


    toDataUrl(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }


    // toDataURL = url => fetch(url)
    //   .then(response => response.blob())
    //   .then(blob => new Promise((resolve, reject) => {
    //     const reader = new FileReader()
    //     // reader.crossOrigin = 'Anonymous';
    //     reader.onloadend = () => resolve(reader.result)
    //     reader.onerror = reject
    //     reader.readAsDataURL(blob)
    //   }))


    blankVariable(){
      this.imageChangedEvent = '';
      this.croppedImage ='';
      this.imageURL = '';    
    }






}
