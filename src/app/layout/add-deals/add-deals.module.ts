import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddDealsRoutingModule } from './add-deals-routing.module';
import { AddDealsComponent } from './add-deals.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'angular-archwizard';
import { MediaSelectionModule } from '../media-selection/media-selection.module';


@NgModule({
  imports: [
    CommonModule,
    AddDealsRoutingModule,
    CKEditorModule,
    FormsModule,
    NgbModule,
    ArchwizardModule,
    MediaSelectionModule
  ],
  declarations: [AddDealsComponent]
})
export class AddDealsModule { }
