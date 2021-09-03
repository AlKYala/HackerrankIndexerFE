import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DataReaderComponent } from './data-reader/data-reader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app.routing-module";
import { NavbarComponent } from './navbar/navbar.component';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { SubmissionListingComponent } from './submission-listing/submission-listing.component';
import { SubmissionDetailComponent } from './submission-detail/submission-detail.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    AppComponent,
    DataReaderComponent,
    NavbarComponent,
    SubmissionListComponent,
    SubmissionListingComponent,
    SubmissionDetailComponent,
    AnalyticsComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
