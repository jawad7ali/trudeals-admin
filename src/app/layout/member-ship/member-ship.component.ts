import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableResource } from 'angular5-data-table';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-ship',
  templateUrl: './member-ship.component.html',
  styleUrls: ['./member-ship.component.scss']
})
export class MemberShipComponent implements OnInit {

  token:string;
  data:any = {};
  totalMemberShip:number =2;
  itemCount = 1;
  limits = [10, 20, 40, 80];
  memberShips = [];

  constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) {
   }

  ngOnInit() {
    this.token = localStorage.getItem('auth-token');
    if(this.token == null){
        this.router.navigate(['/login']);
    }
  }

  itemResource = new DataTableResource(this.memberShips);

  // Method for dynamic pagination 
  reloadItems(params) {
    this.getMemberShipList()
  }

  rowTooltip(item) {
    return item.jobTitle;
  }

  // Service to get location list
  getMemberShipList(){
      this.spinner.show();
      this.service.getMemberShipList(this.token)
        .then((result) => {
              let serverResponce:any = result;
              this.memberShips = serverResponce.data.memberShipDetails;
              this.itemResource = new DataTableResource(this.memberShips);
              this.itemResource.count().then(count => this.itemCount = this.totalMemberShip);
              this.spinner.hide();
          }, (error)=>{
          this.spinner.hide();
          this.toastr.error("Server not responding.Please try again later.");
      });
  }


}
