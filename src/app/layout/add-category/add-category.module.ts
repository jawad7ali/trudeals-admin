import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCategoryRoutingModule } from './add-category-routing.module';
import { AddCategoryComponent } from './add-category.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropperComponent } from '../components/cropper/cropper.component';
import { CropperModule } from '../components/cropper/cropper.module';


@NgModule({
  imports: [
    CommonModule,
    AddCategoryRoutingModule,
    NgbModule,
    FormsModule,
    ImageCropperModule,
    NgbModule,
    CropperModule
  ],
  declarations: [AddCategoryComponent]
})
export class AddCategoryModule { }
