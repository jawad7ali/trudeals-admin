import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBusinessRoutingModule } from './add-business-routing.module';
import { AddBusinessComponent } from './add-business.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ArchwizardModule } from 'angular-archwizard';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DndModule} from 'ngx-dnd';
import { MediaSelectionModule } from '../media-selection/media-selection.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxStripeModule } from 'ngx-stripe';
import {environment} from '../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    AddBusinessRoutingModule,
    GooglePlaceModule,
    ArchwizardModule,
    FormsModule,
    NgbModule,
    DndModule.forRoot(),
    MediaSelectionModule,
    CKEditorModule,
    NgxStripeModule.forRoot(environment.stripeKey)
  ],
  declarations: [AddBusinessComponent]
})
export class AddBusinessModule { }
