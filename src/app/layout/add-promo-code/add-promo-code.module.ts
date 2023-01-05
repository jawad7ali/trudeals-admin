import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPromoCodeRoutingModule } from './add-promo-code-routing.module';
import { AddPromoCodeComponent } from './add-promo-code.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    AddPromoCodeRoutingModule,
    FormsModule,
    NgbModule
  ],
  declarations: [AddPromoCodeComponent]
})
export class AddPromoCodeModule { }
