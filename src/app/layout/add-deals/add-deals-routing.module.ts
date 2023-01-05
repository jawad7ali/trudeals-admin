import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDealsComponent } from './add-deals.component';

const routes: Routes = [
  {
    path:'',
    component:AddDealsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddDealsRoutingModule { }
