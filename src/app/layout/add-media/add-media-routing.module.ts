import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMediaComponent } from './add-media.component';

const routes: Routes = [
  {
    path:'',
    component:AddMediaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddMediaRoutingModule { }
