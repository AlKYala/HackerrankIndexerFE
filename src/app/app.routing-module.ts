import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {SubmissionListComponent} from "./submission-list/submission-list.component";
import {SubmissionDetailComponent} from "./submission-detail/submission-detail.component";
import {AnalyticsComponent} from "./analytics/analytics.component";
import {LandingComponent} from "./landing/landing.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {path: 'submission/:id', component: SubmissionDetailComponent},
  {path: 'challenge/:challengeId/submissions', component: SubmissionListComponent},
  {path: 'language/:pLanguageId/submissions', component: SubmissionListComponent},
  {path: 'submissions', component: SubmissionListComponent},
  {path: 'analytics', component: AnalyticsComponent},
  {path: 'login', component: LoginComponent}, //temporaer
  {path: '', component: LandingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
