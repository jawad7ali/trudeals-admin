import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from 'angular5-data-table';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    LocationRoutingModule,
    NgbModule,
    DataTableModule.forRoot(),
    FormsModule
  ],
  declarations: [LocationComponent]
})
export class LocationModule { }
