import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaSelectionComponent } from './media-selection.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [MediaSelectionComponent],
  exports:[MediaSelectionComponent]
})
export class MediaSelectionModule { }
