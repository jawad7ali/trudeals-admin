import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QaRoutingModule } from './qa-routing.module';
import { QaComponent } from './qa.component';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  imports: [
    CommonModule,
    QaRoutingModule,
    FormsModule,
    CKEditorModule
  ],
  declarations: [QaComponent]
})
export class QaModule { }
