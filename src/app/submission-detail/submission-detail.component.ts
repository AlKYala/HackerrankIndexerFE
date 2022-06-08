import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Submission} from "../../shared/datamodels/Submission/model/Submission";
import {formatDate} from "@angular/common";
import {Subscription} from "rxjs";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {SubmissionService} from "../../shared/datamodels/Submission/service/SubmissionService";
import {ActivatedRoute, Router} from "@angular/router";
import {SubmissionDataService} from "../../shared/services/SubmissionDataService";
import {SubmissionDownloadService} from "../../shared/services/SubmissionDownloadService";
import {SubmissionFlat} from "../../shared/datamodels/Submission/model/SubmissionFlat";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {SubmissionFlatService} from "../../shared/datamodels/Submission/service/SubmissionFlatService";
import {Challenge} from "../../shared/datamodels/Challenge/model/Challenge";
import {Contest} from "../../shared/datamodels/Contest/model/Contest";

@Component({
  selector: 'app-submission-detail',
  templateUrl: './submission-detail.component.html',
  styleUrls: ['./submission-detail.component.scss']
})
export class SubmissionDetailComponent implements OnInit, OnDestroy {

  submission!: Submission;
  submissionFlat!: SubmissionFlat;
  private subscriptions!: Subscription[];
  public loaded: boolean = false;
  private submissionid!: number;
  submissionCode: string = "";
  pLanguage!: Planguage;
  challenge!: Challenge;
  contest!: Contest;

  constructor(private subscriptionService: SubscriptionService,
              private submissionService: SubmissionService,
              private submissionDataService: SubmissionDataService,
              private route: ActivatedRoute,
              private router: Router,
              private submissionFlatService: SubmissionFlatService,
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
    ////console.log(id);
    if(typeof id === "string") {
      this.submissionid = parseInt(id);
    }
    ////console.log(this.submissionid);
  }

  private async fetchSubmission() {
    /*this.submissionService.findById(this.submissionid).pipe().subscribe((submission: Submission) => {
      if(submission.id == 0) {
        this.routeToHomepage();
      }
      this.submission = submission;
      ////console.log(submission);
      this.submissionCode = submission.code;
      this.loaded = true;
    });*/
    await this.submissionService.findById(this.submissionid).toPromise().then((submission: Submission) => {
      if(submission.id == 0)
        this.routeToHomepage();
      this.submission = submission;
      this.submissionCode = submission.code;
    });
    await this.submissionFlatService.findById(this.submissionid).toPromise()
      .then((submissionFlat: SubmissionFlat) => {
        this.submissionFlat = submissionFlat;
        this.pLanguage = submissionFlat.language;
        this.contest = submissionFlat.contest;
        this.challenge = submissionFlat.challenge;
    });
    this.loaded = true;
  }

  public generateAndDownloadSubmission() {
    this.submissionDownloadService.generateAndDownloadSubmission(this.submission, this.submissionFlat);
  }

  public routeToLanguage(event: Event): void {
    /*event.preventDefault();
    this.router.navigate([`/language/${this.submission.language.id}/submissions`]);*/
    //TODO
  }

  public routeToChallenge(event: Event): void {
    /*event.preventDefault();
    this.router.navigate([`/challenge/${this.submission.challenge.id}/submissions`]);*/
  }

  private routeToHomepage() {
    this.router.navigate([`/home`]);
  }
}
