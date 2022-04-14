import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Submission} from "../../shared/datamodels/Submission/model/Submission";
import {formatDate} from "@angular/common";
import {Subscription} from "rxjs";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {SubmissionService} from "../../shared/datamodels/Submission/service/SubmissionService";
import {ActivatedRoute, Router} from "@angular/router";
import {SubmissionDataService} from "../../shared/services/SubmissionDataService";
import {SubmissionDownloadService} from "../../shared/services/SubmissionDownloadService";

@Component({
  selector: 'app-submission-detail',
  templateUrl: './submission-detail.component.html',
  styleUrls: ['./submission-detail.component.scss']
})
export class SubmissionDetailComponent implements OnInit, OnDestroy {

  submission!: Submission;
  private subscriptions!: Subscription[];
  public loaded: boolean = false;
  private submissionid!: number;
  submissionCode!: string;

  constructor(private subscriptionService: SubscriptionService,
              private submissionService: SubmissionService,
              private submissionDataService: SubmissionDataService,
              private route: ActivatedRoute,
              private router: Router,
              private submissionDownloadService: SubmissionDownloadService) {
  }

  //TODO wenn die SubmissionID 0 ist dann fehlerfeld - keine Submission hat ID 0!

  ngOnInit(): void {
    this.subscriptions = [];
    this.resolveSubmissionId();
    this.fetchSubmission();
  }

  ngOnDestroy() {
    this.subscriptionService.unsubscribeParam(this.subscriptions);
  }

  private resolveSubmissionId(): void {
    const id = this.route.snapshot.paramMap.get('id');
    //console.log(id);
    if(typeof id === "string") {
      this.submissionid = parseInt(id);
    }
    //console.log(this.submissionid);
  }

  private fetchSubmission() {
    this.submissionService.findById(this.submissionid).pipe().subscribe((submission: Submission) => {
      if(submission.id == 0) {
        this.routeToHomepage();
      }
      this.submission = submission;
      //console.log(submission);
      this.submissionCode = submission.code;
      this.loaded = true;
    });
  }

  public generateAndDownloadSubmission() {
    this.submissionDownloadService.generateAndDownloadSubmission(this.submission);
  }

  public routeToLanguage(event: Event): void {
    event.preventDefault();
    this.router.navigate([`/language/${this.submission.language.id}/submissions`]);
  }

  public routeToChallenge(event: Event): void {
    event.preventDefault();
    this.router.navigate([`/challenge/${this.submission.challenge.id}/submissions`]);
  }

  private routeToHomepage() {
    this.router.navigate([`/home`]);
  }
}
