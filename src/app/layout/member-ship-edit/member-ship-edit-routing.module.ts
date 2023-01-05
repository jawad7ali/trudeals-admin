import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberShipEditComponent } from './member-ship-edit.component';

const routes: Routes = [
  {
    path:'',
    component:MemberShipEditComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberShipEditRoutingModule { }
