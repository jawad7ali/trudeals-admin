import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddUsersRoutingModule } from './add-users-routing.module';
import { AddUsersComponent } from './add-users.component';
import { FormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import {environment} from '../../../environments/environment'

@NgModule({
  imports: [
    CommonModule,
    AddUsersRoutingModule,
    FormsModule,
    NgxStripeModule.forRoot(environment.stripeKey)
  ],
  declarations: [AddUsersComponent]
})
export class AddUsersModule { }
