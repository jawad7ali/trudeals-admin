import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropperComponent } from './cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    ImageCropperModule
  ],
  declarations: [CropperComponent],
  exports:[CropperComponent]
})
export class CropperModule { }
