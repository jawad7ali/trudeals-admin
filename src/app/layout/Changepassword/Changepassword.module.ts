import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { ChangePasswordRoutingModule } from './Changepassword-routing.module';
import { ChangePasswordComponent } from './Changepassword.component';
import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, Ng2Charts, ChangePasswordRoutingModule, PageHeaderModule, FormsModule],
    declarations: [ChangePasswordComponent]
})
export class ChangePasswordModule {}
