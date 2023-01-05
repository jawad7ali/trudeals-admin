import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthGuard } from "./shared";
import { FormsModule } from "@angular/forms";
import { ApiService } from "./api.service";
import { ToastrModule, ToastContainerModule } from "ngx-toastr";
import { LoginGuard } from "./login.guard";
import { CKEditorModule } from "ng2-ckeditor";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
// import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ImageCropperModule } from "ngx-image-cropper";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { ApiHttp } from "./api.http";
import { MatVideoModule } from "mat-video";
import { PageBlocksModule } from "./layout/page-blocks/page-blocks.module";

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        AppRoutingModule,
        FormsModule,
        ToastrModule.forRoot(),
        CKEditorModule,
        NgxSpinnerModule,
        NgbModule.forRoot(),
        LoadingBarRouterModule,
        ImageCropperModule,
        MatVideoModule,
        // LoadingBarModule,
        // LoadingBarHttpClientModule
    ],
    declarations: [AppComponent],
    providers: [AuthGuard, ApiService, ApiHttp, LoginGuard],
    bootstrap: [AppComponent],
})
export class AppModule {}
