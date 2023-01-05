import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBusinessComponent } from './add-business.component';

const routes: Routes = [
  {
    path:'',
    component:AddBusinessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBusinessRoutingModule { }


