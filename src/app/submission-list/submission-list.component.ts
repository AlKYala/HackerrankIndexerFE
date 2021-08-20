import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Submission} from "../../shared/datamodels/Submission/model/Submission";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css']
})
export class SubmissionListComponent implements OnInit {

  submissions: Submission[] = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllSubmissions();
  }

  //TODO Services fuer models schreiben
  private getAllSubmissions() {
    this.getAllSubmissionsRequest().pipe().subscribe((submissions: Submission[]) => {
      console.log(submissions);
      this.submissions = submissions;
    });
  }

  private getAllSubmissionsRequest(): Observable<Submission[]> {
    return this.httpClient.get(`${environment.api}/submission`) as Observable<Submission[]>;
  }

}
