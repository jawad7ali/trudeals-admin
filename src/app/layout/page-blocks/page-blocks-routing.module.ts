import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageBlocksComponent } from "./page-blocks.component";
import { AddPageBlocksComponent } from "./add-page-blocks/add-page-blocks.component";

const routes: Routes = [
    {
        path: "",
        component: PageBlocksComponent,
    },
    {
        path: "new",
        component: AddPageBlocksComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PageBlocksRoutingModule {}
