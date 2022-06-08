import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app.routing-module";
import {NavbarComponent} from './navbar/navbar.component';
import {SubmissionListComponent} from './submission-list/submission-list.component';
import {SubmissionDetailComponent} from './submission-detail/submission-detail.component';
import {AnalyticsComponent} from './analytics/analytics.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgxChartModule} from "ngx-chart";
import {PieChartModule} from "@swimlane/ngx-charts";
import {GeneralstatscomponentComponent} from './generalstatscomponent/generalstatscomponent.component';
import {ChartcomponentComponent} from './chartcomponent/chartcomponent.component';
import {LandingComponent} from './landing/landing.component';
import {HowtocomponentComponent} from './howtocomponent/howtocomponent.component';
import {ChartsModule} from "ng2-charts";
import {NgxWebstorageModule} from "ngx-webstorage";
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NavbarWithoutLoginComponent } from './navbar-without-login/navbar-without-login.component';
import { FooterComponent } from './footer/footer.component';
import {ToastrModule} from "ngx-toastr";
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import {NgxBootstrapConfirmModule} from "ngx-bootstrap-confirm";
import { ShareComponentComponent } from './share-component/share-component.component';
import {NgxMasonryModule} from "ngx-masonry";
import { InitialLandingComponent } from './initial-landing/initial-landing.component';
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";
import { PermalinkComponentComponent } from './permalink-component/permalink-component.component';
import { UserDataSelectorComponent } from './user-data-selector/user-data-selector.component';
import {HIGHLIGHT_OPTIONS, HighlightModule} from "ngx-highlightjs";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SubmissionListComponent,
    SubmissionDetailComponent,
    AnalyticsComponent,
    GeneralstatscomponentComponent,
    ChartcomponentComponent,
    LandingComponent,
    HowtocomponentComponent,
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    NavbarWithoutLoginComponent,
    FooterComponent,
    SetNewPasswordComponent,
    VerifyUserComponent,
    ShareComponentComponent,
    InitialLandingComponent,
    PermalinkComponentComponent,
    UserDataSelectorComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgxChartModule,
    PieChartModule,
    ChartsModule,
    NgxWebstorageModule.forRoot(),
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgxBootstrapConfirmModule,
    NgxMasonryModule,
    BrowserModule,
    NgxQRCodeModule,
    HighlightModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
