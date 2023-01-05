import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './business.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from 'angular5-data-table';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BusinessRoutingModule,
    NgbModule,
    DataTableModule.forRoot(),
    FormsModule
  ],
  declarations: [BusinessComponent]
})
export class BusinessModule { }
