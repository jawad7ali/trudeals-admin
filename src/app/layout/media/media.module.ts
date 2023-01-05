import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaRoutingModule } from './media-routing.module';
import { MediaComponent } from './media.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    MediaRoutingModule,
    NgbModule,
    FormsModule,
    LazyLoadImageModule
  ],
  declarations: [MediaComponent]
})
export class MediaModule { }
