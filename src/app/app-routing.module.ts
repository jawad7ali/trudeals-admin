import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./shared";
import { LoginGuard } from "./login.guard";

const routes: Routes = [
    {
        path: "",
        loadChildren: "./layout/layout.module#LayoutModule",
        canActivate: [AuthGuard],
    },
    {
        path: "login",
        loadChildren: "./login/login.module#LoginModule",
        canActivate: [LoginGuard],
    },
    {
        path: "forgotPassword",
        loadChildren:
            "./forgotPassword/forgotPassword.module#ForgotPasswordModule",
    },
    {
        path: "error",
        loadChildren: "./server-error/server-error.module#ServerErrorModule",
    },
    {
        path: "access-denied",
        loadChildren: "./access-denied/access-denied.module#AccessDeniedModule",
    },
    {
        path: "not-found",
        loadChildren: "./not-found/not-found.module#NotFoundModule",
    },
    {
        path: "**",
        redirectTo: "not-found",
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
