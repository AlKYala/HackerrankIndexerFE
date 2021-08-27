import {RouterModule, Routes} from "@angular/router";
import {DataReaderComponent} from "./data-reader/data-reader.component";
import {AppComponent} from "./app.component";
import {NgModule} from "@angular/core";
import {SubmissionListComponent} from "./submission-list/submission-list.component";
import {SubmissionDetailComponent} from "./submission-detail/submission-detail.component";

const routes: Routes = [
  {path: 'upload', component: DataReaderComponent},
  {path: 'submissions', component: SubmissionListComponent},
  {path: 'submission/:id', component: SubmissionDetailComponent},
  {path: 'submissions/challenge/:challengeId', component: SubmissionListComponent},
  {path: 'submissions/pLanguage/:planguageId', component: SubmissionListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
