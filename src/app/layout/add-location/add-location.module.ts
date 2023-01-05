import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddLocationRoutingModule } from './add-location-routing.module';
import { AddLocationComponent } from './add-location.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AddLocationRoutingModule,
    NgbModule,
    GooglePlaceModule,
    FormsModule
  ],
  declarations: [AddLocationComponent]
})
export class AddLocationModule { }
