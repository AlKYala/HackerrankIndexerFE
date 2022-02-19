import {Component, Input, OnDestroy, OnInit, EventEmitter} from '@angular/core';
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
import {RequestServiceEnum} from "../../shared/services/ServiceHandler/RequestServiceEnum";
import {environment} from "../../environments/environment";
import {RequestService} from "../../shared/services/ServiceHandler/RequestService";
import {JwPaginationComponent} from "jw-angular-pagination";
import paginate from "jw-paginate";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {FormControl} from "@angular/forms";
/**
 * TODO: du musst die pagination fixen
 * Wenn du dieses Component 2x nebeneinander hast, sieht das kacke aus
 * z.B. 2 Listen mit 2 verschiedenen Seitenanzahlen
 * Dann beeinflussen diese sich gegenseitig - das ist zu verhindern!
 *
 * Erste idee: Sind components singletons?
 */

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.scss']
})
export class SubmissionListComponent implements OnInit, OnDestroy {

  submissions: Submission[] = [];
  submissionsBackup: Submission[] = [];
  private mainSubscription: Subscription;

  @Input()
  inputChallengeId: number | undefined;
  @Input()
  inputLanguageid: number | undefined;

  @Input()
  isOnAnalyticsPage: boolean | undefined;

  filteredByInput: boolean = false;

  private challengeId: number = -1;
  private pLanguageId: number = -1;
  faCoffee = faCoffee;
  //page: number = 1;
  //pageLimit: number = 16;

  public languages!: Planguage[];
  public enabledLanguages!: boolean[];
  private selectedLanguages: Set<number>;

  onlyPassedSubmissions:      boolean   = false;
  onlyFailedSubmissions:      boolean   = false;
  onlyLastPassedSubmissions:  boolean   = false;

  searchFormControl = new FormControl();
  pageOfItems!: Array<any>;
  pageSize = 5;
  pager: any = {};
  changePage = new EventEmitter<any>(true);
  maxPages = 5;

  constructor(private httpClient: HttpClient,
              private submissionService: SubmissionService,
              private submissionDataService: SubmissionDataService,
              private route: ActivatedRoute,
              private pLanguageService: PLanguageService,
              private challengeService: ChallengeService,
              private router: Router,
              private requestService: RequestService) {
    this.mainSubscription   = new Subscription();
    this.selectedLanguages  = new Set<number>();
  }

  ngOnInit(): void {
    this.scanForFilter();
    this.initLanguages();
  }

  ngOnDestroy(): void {
  }

  public filterSubmissions() {
    const search = this.searchFormControl.value;
    console.log(search);
    if(search == null || search.length == 0) {
      this.submissions = this.submissionsBackup;
      return;
    }
    this.submissions = this.submissionsBackup.filter(submission => submission.challenge.challengeName.includes(search));
    console.log(this.submissions);
    this.pageOfItems = this.submissions;
  }

  public clickLanguage(pLanguage: Planguage): void {
    const id: number = pLanguage.id!;
    if(this.selectedLanguages.has(id)) {
      this.selectedLanguages.delete(id);
      return;
    }

    this.selectedLanguages.add(id);
  }

  public fireLanguageFilter() {
    this.filterByLanguageIDs();
  }

  public checkOnlyPassedSubmissions() {
    if(this.onlyPassedSubmissions) {
      this.onlyPassedSubmissions = false;
      return;
    }
    this.onlyFailedSubmissions = false;
    this.onlyLastPassedSubmissions = false;
    this.onlyPassedSubmissions = true;
  }

  public checkOnlyFailedSubmissions() {
    if(this.onlyFailedSubmissions) {
      this.onlyFailedSubmissions = false;
      return;
    }
    this.onlyFailedSubmissions = true;
    this.onlyLastPassedSubmissions = false;
    this.onlyPassedSubmissions = false;
  }

  public checkOnlyLastPassedSubmissions() {
    if(this.onlyLastPassedSubmissions) {
      this.onlyLastPassedSubmissions = false;
      return;
    }
    this.onlyFailedSubmissions = false;
    this.onlyLastPassedSubmissions = true;
    this.onlyPassedSubmissions = false;
  }

  private filterByLanguageIDs() {
    if(this.selectedLanguages.size == 0) {
      return;
    }
    for(let submission of this.submissionsBackup) {
      if(this.selectedLanguages.has(submission.language.id!)) {
        this.submissions.push(submission);
      }
    }
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
        this.setPage(1);
      })
    this.mainSubscription.add(subscription);
  }

  private getSubmissionsByPLanguageId(pLanguageId: number) {
    const subscription: Subscription = this.pLanguageService.getSubmissionsByPLanguageId(pLanguageId)
      .pipe().subscribe((submissions: Submission[]) => {
        this.submissions = submissions;
      })
    this.mainSubscription.add(subscription);
  }

  private getAllSubmissions() {
    const subscription : Subscription = this.submissionService.findAll().
    pipe().subscribe((submissions: Submission[]) => {
      this.submissions = submissions;
      this.submissionsBackup = submissions;
    });
    this.mainSubscription.add(subscription);
  }

  private getAllSubmissionsRequest(): Observable<Submission[]> {
    //return this.httpClient.get(`${environment.api}/submission`) as Observable<Submission[]>;
    //TODO try this and check if works
    return this.requestService.anyRequest(RequestServiceEnum.GET, `${environment.api}/submission`) as Observable<Submission[]>;
  }

  public navigateToListingDetail(submission: Submission): void {
    this.submissionDataService.setSubmission(submission);
    this.router.navigate([`/submission/${submission.id}`]);
  }

  onChangePage(pageOfitems: Array<any>) {
    this.pageOfItems = pageOfitems;
  }

  private setPage(page: number) {
    this.pager = paginate(this.submissions.length, page, this.pageSize, this.maxPages);
    var pageOfItems = this.submissions.slice(this.pager.startIndex, this.pager.endIndex +1);
    this.changePage.emit(pageOfItems);
  }

  private initLanguages() {
    const subscription: Subscription = this.pLanguageService.findAll().subscribe((data: Planguage[]) => {
      this.languages = data;
      this.enableLanguages(data.length);
    });
    this.mainSubscription.add(subscription);
  }

  private enableLanguages(size: number): void {
    this.enabledLanguages = new Array<boolean>(size);
    if(this.inputLanguageid == -1) {
      this.enabledLanguages.fill(true, 0, size);
      console.log(this.enabledLanguages);
      return;
    }
    this.enabledLanguages.fill(false, 0, size);
    for(let i = 0; i < size; i++) {
      if(this.languages[i].id == this.inputLanguageid) {
        this.enabledLanguages[i] = true;
        return;
      }
    }
  }
}
