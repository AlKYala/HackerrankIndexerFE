import {RouterModule, Routes} from "@angular/router";
import {DataReaderComponent} from "./data-reader/data-reader.component";
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {SubmissionListComponent} from "./submission-list/submission-list.component";
import {SubmissionDetailComponent} from "./submission-detail/submission-detail.component";

const routes: Routes = [
  {path: 'upload', component: DataReaderComponent},
  {path: 'submission/:id', component: SubmissionDetailComponent},
  {path: 'challenge/:challengeId/submissions', component: SubmissionListComponent},
  {path: 'language/:pLanguageId/submissions', component: SubmissionListComponent},
  {path: 'submissions', component: SubmissionListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
