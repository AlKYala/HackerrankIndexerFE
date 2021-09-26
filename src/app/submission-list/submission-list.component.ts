import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subscription} from "rxjs";
import {Submission} from "../../shared/datamodels/Submission/model/Submission";
import {SubmissionService} from "../../shared/datamodels/Submission/service/SubmissionService";
import {ActivatedRoute, Router} from "@angular/router";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {ChallengeService} from "../../shared/datamodels/Challenge/service/ChallengeService";
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {SubmissionDataService} from "../../shared/services/SubmissionDataService";
import {ServiceHandler} from "../../shared/services/ServiceHandler/ServiceHandler";
import {ServiceHandlerEnum} from "../../shared/services/ServiceHandler/ServiceHandlerEnum";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.scss']
})
export class SubmissionListComponent implements OnInit, OnDestroy {

  submissions: Submission[] = [];
  private subscriptions: Subscription[] = [];

  @Input()
  inputChallengeId: number | undefined;
  @Input()
  inputLanguageid: number | undefined;

  filteredByInput: boolean = false;

  private challengeId: number = -1;
  private pLanguageId: number = -1;
  faCoffee = faCoffee;
  page: number = 1;
  pageLimit: number = 16;

  constructor(private httpClient: HttpClient,
              private submissionService: SubmissionService,
              private submissionDataService: SubmissionDataService,
              private route: ActivatedRoute,
              private pLanguageService: PLanguageService,
              private challengeService: ChallengeService,
              private router: Router,
              private serviceHandler: ServiceHandler<Submission>) { }

  ngOnInit(): void {
    this.scanForFilter();
  }

  ngOnDestroy(): void {
  }

  private scanForFilter() {
    const foundRouting: boolean = this.scanForRoutingParameters();
    if(foundRouting) {
      return;
    }
    const foundInput: boolean = this.scanForInputParameters();
    if(foundInput) {
      return;
    }
    this.getAllSubmissions();
  }

  /**
   * Returns true if filter fires
   * @private
   */
  private scanForInputParameters(): boolean {
    if(this.inputChallengeId != null && this.inputChallengeId > -1) {
      this.getSubmissionsByChallengeId(this.inputChallengeId);
      this.filteredByInput = true;
      return true;
    }
    if(this.inputLanguageid != null && this.inputLanguageid > -1) {
      this.filteredByInput = true;
      this.getSubmissionsByPLanguageId(this.inputLanguageid);
      return true;
    }
    return false;
  }

  /**
   * Returns true if filter fires
   * @private
   */
  private scanForRoutingParameters(): boolean {
    const challengeIdString = this.route.snapshot.paramMap.get('challengeId');
    const pLanguageIdString = this.route.snapshot.paramMap.get('pLanguageId');

    if(typeof challengeIdString == 'string') {
      const challengeId: number = parseInt(challengeIdString);
      this.getSubmissionsByChallengeId(challengeId);
      return true;
    }
    else if(typeof pLanguageIdString == 'string') {
      const pLanguageId: number = parseInt(pLanguageIdString);
      this.getSubmissionsByPLanguageId(pLanguageId);
      return true;
    }
    return false;
  }

  private getSubmissionsByChallengeId(challengeId: number) {
    const subscription: Subscription = this.challengeService.getSubmissionsByChallengeId(challengeId)
      .pipe().subscribe((submissions: Submission[]) => {
        this.submissions = submissions;
      })
    this.subscriptions.push(subscription);
  }

  private getSubmissionsByPLanguageId(pLanguageId: number) {
    const subscription: Subscription = this.pLanguageService.getSubmissionsByPLanguageId(pLanguageId)
      .pipe().subscribe((submissions: Submission[]) => {
        this.submissions = submissions;
      })
    this.subscriptions.push(subscription);
  }

  private getAllSubmissions() {
    const subscription : Subscription = this.submissionService.findAll().
    pipe().subscribe((submissions: Submission[]) => {
      this.submissions = submissions;
    });
    this.subscriptions.push(subscription);
  }

  private getAllSubmissionsRequest(): Observable<Submission[]> {
    //return this.httpClient.get(`${environment.api}/submission`) as Observable<Submission[]>;
    //TODO try this and check if works
    return this.serviceHandler.anyRequest(ServiceHandlerEnum.GET, `${environment.api}/submission`) as Observable<Submission[]>;
  }

  public navigateToListingDetail(submission: Submission): void {
    this.submissionDataService.setSubmission(submission);
    this.router.navigate([`/submission/${submission.id}`]);
  }
}
