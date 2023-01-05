import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromoCodeRoutingModule } from './promo-code-routing.module';
import { PromoCodeComponent } from './promo-code.component';
import { DataTableModule } from 'angular5-data-table';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PromoCodeRoutingModule,
    DataTableModule.forRoot(),
    FormsModule
  ],
  declarations: [PromoCodeComponent]
})
export class PromoCodeModule { }
