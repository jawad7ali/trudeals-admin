import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddNewsRoutingModule } from './add-news-routing.module';
import { AddNewsComponent } from './add-news.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    AddNewsRoutingModule,
    CKEditorModule,
    FormsModule,
    NgbModule
  ],
  declarations: [AddNewsComponent]
})
export class AddNewsModule { }
