import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPromoCodeComponent } from './add-promo-code.component';

const routes: Routes = [
  {
    path:'',
    component:AddPromoCodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPromoCodeRoutingModule { }
