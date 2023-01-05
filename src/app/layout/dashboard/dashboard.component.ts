import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {ApiService} from '../../api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    
    dashboardCount:any={};
    token:any;
    serverResponses;

    constructor(public service: ApiService, private toastr: ToastrService,private spinner: NgxSpinnerService,public router: Router) { }
    
    ngOnInit() {
        this.token = localStorage.getItem('auth-token');
        this.getDashboardCount();
        if(this.token == null){
            this.router.navigate(['/login']);
        }
    }

    // Method to get dashboard count
    getDashboardCount(){
    // this.spinner.show();
    this.service.getDashboardCount(this.token)
        .then((result) => {
            let serverResponce:any = result;
            this.dashboardCount = serverResponce.data.counts;
           
            // Pie chart dynamic data
            // if(serverResponce.response.pieChart){
                // this.pieChart.nvsSightings = serverResponce.response.pieChart.nvsSightings;
                // this.pieChart.vsSightings = serverResponce.response.pieChart.vsSightings;
                this.pieChartData = [this.dashboardCount.activeBusinessOwnerCount,this.dashboardCount.activeCustomerCount];
            // }else{
                // this.pieChartData = [20,30];
            // }

            this.serverResponses = 'true';
            // this.spinner.hide();
            }, (error)=>{
            this.spinner.hide();
            if(error.error.status == 404){
            // this.bannerList = [];
            // this.toasterService.pop('error', 'Error', error.error.message);  
            }else{
            this.toastr.error("Server not responding.Please try again later.");
            }
            // this.toasterService.pop('error', 'Error', error.statusText);
            
        });
    }
    
     // Pie Chart
     public chartClicked(e: any): void {
    }

    public chartHovered(e: any): void {
    }
    public pieChartType: string = 'pie';
    
    
    public pieChartLabels: string[] = [
        'Active Business Owner %',
        'Active Customer %',
    ];
    public pieChartData = [];


}
