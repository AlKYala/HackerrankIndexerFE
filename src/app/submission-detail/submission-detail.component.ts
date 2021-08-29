import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Submission} from "../../shared/datamodels/Submission/model/Submission";
import {formatDate} from "@angular/common";
import {Subscription} from "rxjs";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {SubmissionService} from "../../shared/datamodels/Submission/service/SubmissionService";
import {ActivatedRoute, Router} from "@angular/router";
import {SubmissionDataService} from "../../shared/services/SubmissionDataService";

@Component({
  selector: 'app-submission-detail',
  templateUrl: './submission-detail.component.html',
  styleUrls: ['./submission-detail.component.css']
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
              private router: Router) {
  }

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
    console.log(id);
    if(typeof id === "string") {
      this.submissionid = parseInt(id);
    }
    console.log(this.submissionid);
  }

  private fetchSubmission() {
    this.submissionService.findById(this.submissionid).pipe().subscribe((submission: Submission) => {
      this.submission = submission;
      this.submissionCode = submission.code.replace(/\n/g, "\r\n");
      this.loaded = true;
    });
  }

  public generateAndDownloadSubmission() {
    let a = document.createElement("a");
    document.body.appendChild(a);
    const blob = new Blob([this.generateFileContents(this.submission)], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    const fileName: string = `${this.submission.challenge.challengeName.replace(/\s/g, "")}.java`;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateFileContents(submission: Submission): string {
    return `${this.generateDocumentInfo(submission)}\n${submission.code}`;
  }

  private generateDocumentInfo(submission: Submission): string {
    return `/**\nPowered by HackerrankIndexer by Ali Yalama 2021\n
    https://github.com/AlKYala/HackerRankIndexer\n
    File created: ${this.getCurrentDateAsString()}\n
    Challenge name: ${submission.challenge.challengeName}\n
    Author: ${submission.writer.username}\n*/\n`;
  }

  private getCurrentDateAsString(): string {
    return formatDate(new Date(), "dd/MM/yyyy", 'en');
  }

  public routeToLanguage(event: Event): void {
    event.preventDefault();
    this.router.navigate([`/language/${this.submission.language.id}/submissions`]);
  }

  public routeToChallenge(event: Event): void {
    event.preventDefault();
    this.router.navigate([`/challenge/${this.submission.challenge.id}/submissions`]);
  }

  /*private getSubmission(id: number): void {
    const subscription: Subscription = this.submissionService.findById(id).pipe().subscribe((submission: Submission) => {
      this.submission = submission;
    });
    this.subscriptions.push(subscription);
  }*/
}
