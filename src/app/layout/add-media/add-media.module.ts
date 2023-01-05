import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMediaRoutingModule } from './add-media-routing.module';
import { AddMediaComponent } from './add-media.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AddMediaRoutingModule,
    FormsModule
  ],
  declarations: [AddMediaComponent]
})
export class AddMediaModule { }
