import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPagesRoutingModule } from './add-pages-routing.module';
import { AddPagesComponent } from './add-pages.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    AddPagesRoutingModule,
    CKEditorModule,
    FormsModule,
    NgbModule
  ],
  declarations: [AddPagesComponent]
})
export class AddPagesModule { }
