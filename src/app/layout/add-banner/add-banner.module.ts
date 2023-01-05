import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBannerRoutingModule } from './add-banner-routing.module';
import { AddBannerComponent } from './add-banner.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    AddBannerRoutingModule,
    FormsModule,
    NgbModule
  ],
  declarations: [AddBannerComponent]
})
export class AddBannerModule { }
