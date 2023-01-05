import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPagesComponent } from './add-pages.component';

const routes: Routes = [
  {
    path:'',
    component:AddPagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPagesRoutingModule { }
