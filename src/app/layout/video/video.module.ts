import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VideoRoutingModule} from './video-routing.module';
import {VideoComponent} from "./video.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {MatVideoModule} from "mat-video";
import {AddVideoComponent} from "./add-video/add-video.component";

@NgModule({
    imports: [
        CommonModule,
        VideoRoutingModule,
        NgbModule,
        FormsModule,
        LazyLoadImageModule,
        MatVideoModule
    ],
    declarations: [VideoComponent, AddVideoComponent]
})
export class VideoModule {
}
