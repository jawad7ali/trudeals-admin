import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberShipEditRoutingModule } from './member-ship-edit-routing.module';
import { MemberShipEditComponent } from './member-ship-edit.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MemberShipEditRoutingModule,
    FormsModule
  ],
  declarations: [MemberShipEditComponent]
})
export class MemberShipEditModule { }
