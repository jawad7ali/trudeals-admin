import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageBlocksComponent } from "./page-blocks.component";
import { PageBlocksRoutingModule } from "./page-blocks-routing.module";
import { AddPageBlocksComponent } from "./add-page-blocks/add-page-blocks.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DataTableModule } from "angular5-data-table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularEditorModule } from "@kolkov/angular-editor";

@NgModule({
    imports: [
        CommonModule,
        PageBlocksRoutingModule,
        NgbModule,
        DataTableModule.forRoot(),
        FormsModule,
        AngularEditorModule,
        ReactiveFormsModule,
    ],
    declarations: [PageBlocksComponent, AddPageBlocksComponent],
})
export class PageBlocksModule {}
