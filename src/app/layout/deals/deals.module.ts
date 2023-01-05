import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealsRoutingModule } from './deals-routing.module';
import { DealsComponent } from './deals.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular5-data-table';

@NgModule({
  imports: [
    CommonModule,
    DealsRoutingModule,
    NgbModule,
    FormsModule,
    DataTableModule.forRoot()
  ],
  declarations: [DealsComponent]
})
export class DealsModule { }
