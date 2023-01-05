import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {environment} from '../../../environments/environment'
import { NgxStripeModule } from 'ngx-stripe';
import { FormsModule } from '@angular/forms';

import { AddAdminsRoutingModule } from './add-admins-routing.module';
import { AddAdminsComponent } from './add-admins.component';

@NgModule({
  imports: [
    CommonModule,
    AddAdminsRoutingModule, 
    FormsModule,
   NgxStripeModule.forRoot(environment.stripeKey)


  ],
  declarations: [AddAdminsComponent]
})
export class AddAdminsModule { }

