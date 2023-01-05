import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgotPassword-routing.module';
import { ForgotPassswordComponent } from './forgotPassword.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    FormsModule
  ],
  declarations: [ForgotPassswordComponent]
})
export class ForgotPasswordModule { }
