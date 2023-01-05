import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VideoComponent} from "./video.component";
import {AddVideoComponent} from "./add-video/add-video.component";

const routes: Routes = [
    {
        path:'',
        component:VideoComponent
    },
    {
        path: '/new',
        component: AddVideoComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
