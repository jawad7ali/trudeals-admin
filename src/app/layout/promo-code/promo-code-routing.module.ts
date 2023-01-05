import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromoCodeComponent } from './promo-code.component';

const routes: Routes = [
 {
   path:'',
   component:PromoCodeComponent
 }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromoCodeRoutingModule { }
