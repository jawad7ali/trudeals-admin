import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from 'angular5-data-table';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NewsRoutingModule,
    NgbModule,
    DataTableModule.forRoot(),
    FormsModule
  ],
  declarations: [NewsComponent]
})
export class NewsModule { }
