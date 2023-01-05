import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberShipRoutingModule } from './member-ship-routing.module';
import { MemberShipComponent } from './member-ship.component';
import { DataTableModule } from 'angular5-data-table';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MemberShipRoutingModule,
    DataTableModule.forRoot(),
    FormsModule
  ],
  declarations: [MemberShipComponent]
})
export class MemberShipModule { }
