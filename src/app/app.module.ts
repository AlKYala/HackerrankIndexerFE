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
import {LanguageSubmissionPassRateComponentComponent} from './language-submission-pass-rate-component/language-submission-pass-rate-component.component';
import {ChartcomponentComponent} from './chartcomponent/chartcomponent.component';
import {NgxPaginationModule} from "ngx-pagination";
import {LandingComponent} from './landing/landing.component';
import {HowtocomponentComponent} from './howtocomponent/howtocomponent.component';
import {IntroFeaturesComponentComponent} from './intro-features-component/intro-features-component.component';
import {JwPaginationModule} from "jw-angular-pagination";
import {ChartsModule} from "ng2-charts";
import {NgxWebstorageModule} from "ngx-webstorage";
import { LoginComponent } from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SubmissionListComponent,
    SubmissionDetailComponent,
    AnalyticsComponent,
    GeneralstatscomponentComponent,
    LanguageSubmissionPassRateComponentComponent,
    ChartcomponentComponent,
    LandingComponent,
    HowtocomponentComponent,
    IntroFeaturesComponentComponent,
    LoginComponent,
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
    NgxPaginationModule,
    JwPaginationModule,
    ChartsModule,
    NgxWebstorageModule.forRoot(),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
