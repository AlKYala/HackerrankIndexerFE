import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DataReaderComponent } from './data-reader/data-reader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app.routing-module";
import {MatSidenavModule} from "@angular/material/sidenav";
import { NavbarComponent } from './navbar/navbar.component';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCommonModule} from "@angular/material/core";
import {MatListModule} from "@angular/material/list";
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { SubmissionListingComponent } from './submission-listing/submission-listing.component';
import {MatCardModule} from "@angular/material/card";
import { SubmissionDetailComponent } from './submission-detail/submission-detail.component';
import { AnalyticsComponent } from './analytics/analytics.component';

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
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatCommonModule,
    MatListModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
