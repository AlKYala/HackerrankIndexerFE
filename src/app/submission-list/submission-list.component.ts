import {Component, Input, OnDestroy, OnInit, EventEmitter, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {async, Observable, Subscription} from "rxjs";
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
import {HashMap} from "../../shared/other/HashMap";
import {FilterRequest} from "../../shared/datamodels/Submission/model/FilterRequest";
import {SubmissionDownloadService} from "../../shared/services/SubmissionDownloadService";
import {DownloadFile} from "../../shared/datamodels/DownloadFile/Model/DownloadFile";
import {NgxBootstrapConfirmService} from "ngx-bootstrap-confirm";
import {LogInOutService} from "../../shared/services/LogInOutService";

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.scss']
})
export class SubmissionListComponent implements OnChanges, OnDestroy {

  @Input()
  submissions: Submission[] = [];

  @Input()
  languages: Planguage[] = [];


  submissionsBackup: Submission[] = [];

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

  public enabledLanguages!: boolean[];
  private selectedLanguages: Set<number>;

  onlyPassedSubmissions:      boolean   = false;
  onlyFailedSubmissions:      boolean   = false;
  onlyLastPassedSubmissions:  boolean   = false;

  searchFormControl = new FormControl();
  pageOfItems!: Array<any>;
  pageSize = 10;
  pager: any = {};
  changePage = new EventEmitter<any>(true);
  maxPages = 10;

  constructor(private httpClient: HttpClient,
              private submissionService: SubmissionService,
              private submissionDataService: SubmissionDataService,
              private route: ActivatedRoute,
              private pLanguageService: PLanguageService,
              private challengeService: ChallengeService,
              private router: Router,
              private logInOutService: LogInOutService,
              private requestService: RequestService,
              private submissionDownloadService: SubmissionDownloadService) {
    this.selectedLanguages  = new Set<number>();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.submissionsBackup = this.submissions;
    this.enableLanguages(this.languages.length); //langaugeSize
  }

  ngOnDestroy(): void {
  }


  /**
   * FILTERING BEGIN
   */

  /**
   * FIred when:
   * Searchbox changes
   * language is clicked
   * after state change (see filter by state)
   * @private
   */
  public fireEnitreFilter() {
    this.submissions = this.submissionsBackup;
    //SEARCHBOX - THIS HAS TO BE FIRST
    this.filterByChallengeName();
    //CHECKBOX STATE
    this.filterByState();
    //LANGUAGES
    this.filterBySelectedLanguages();
  }

  /**
   * FILTERING BY NAME
   */
  public filterByChallengeName() {
    const search = this.searchFormControl.value;
    if(search == null || search.length == 1) {
      this.submissions = this.submissionsBackup; // REASON WHY HAS TO BE FIRST
      return;
    }
    this.submissions = this.submissions
      .filter(submission => submission.challenge.challengeName.toLowerCase().includes(search.toLowerCase()));
  }

  /**
   * FILTERING BY NAME END
   */

  /**
   * FILTERING BY LANGUAGE BEGIN
   */

  private filterBySelectedLanguages() {
    if(this.selectedLanguages.size == 0) {
      return;
    }
    this.submissions = this.submissions
      .filter((submission: Submission) => this.selectedLanguages.has(submission.language.id!));
  }

  public clickLanguage(pLanguage: Planguage): void {

    const id: number = pLanguage.id!;
    if(this.selectedLanguages.has(id)) {
      this.selectedLanguages.delete(id);
    }
    else {
      this.selectedLanguages.add(id);
    }
    this.fireEnitreFilter();
  }

  /**
   * FILTERING BY LANGAUGES END
   */

  /**
   * FILTERING BY STATE BEGIN
   */

  private filterByState() {
    if(this.onlyPassedSubmissions) {
      this.filterForPassedSubmissions();
      return;
    }

    if(this.onlyFailedSubmissions) {
      this.filterForFailedSubmissions();
      return;
    }

    if(this.onlyLastPassedSubmissions) {
      this.filterForMostRecentPassedSubmissions();
    }
  }

  public checkOnlyPassedSubmissions() {


    if(this.onlyPassedSubmissions) {
      this.onlyPassedSubmissions    = false;
      this.fireEnitreFilter();
      return;
    }

    this.onlyFailedSubmissions      = false;
    this.onlyLastPassedSubmissions  = false;
    this.onlyPassedSubmissions      = true;

    this.fireEnitreFilter();
  }

  public checkOnlyFailedSubmissions() {

    if(this.onlyFailedSubmissions) {
      this.onlyFailedSubmissions    = false;
      this.fireEnitreFilter();
      return;
    }
    this.onlyFailedSubmissions      = true;
    this.onlyLastPassedSubmissions  = false;
    this.onlyPassedSubmissions      = false;

    this.fireEnitreFilter();
  }

  public checkOnlyLastPassedSubmissions() {
    if(this.onlyLastPassedSubmissions) {
      this.onlyLastPassedSubmissions  = false;
      this.fireEnitreFilter();
      return;
    }
    this.onlyFailedSubmissions        = false;
    this.onlyLastPassedSubmissions    = true;
    this.onlyPassedSubmissions        = false;

    this.fireEnitreFilter();
  }

  private filterForPassedSubmissions(): void {
    this.submissions = this.submissions
      .filter((submission: Submission) => submission.score == 1);
  }

  private filterForFailedSubmissions(): void {
    this.submissions = this.submissions
      .filter((submission: Submission) => submission.score < 1);
  }

  private filterForMostRecentPassedSubmissions(): void {
    this.filterForPassedSubmissions();

    const mostRecent = {};
    for(const submission of this.submissions) {
      const id: number = submission.id!;
      // @ts-ignore
      mostRecent[submission.challenge.id] = submission;
    }

    const filteredSubmissions: Submission[] = [];

    for(const key of Object.keys(mostRecent)) {
      // @ts-ignore
      filteredSubmissions.push(mostRecent[key]);
    }

    this.submissions = filteredSubmissions;

  }

  /**
   * FILTERING BY STATE END
   */

  /**
   * RESTORE FILTER BEGIN
   */

  public restoreSubmissions() {
    this.resetSearchBox();
    this.resetButtonClicks();
    this.submissions = this.submissionsBackup;
  }

  private resetButtonClicks() {
    this.resetLangaugeClicks();
    this.resetModeButtonClicks();
  }

  private resetModeButtonClicks() {
    this.onlyLastPassedSubmissions  = false;
    this.onlyFailedSubmissions      = false;
    this.onlyPassedSubmissions      = false;
  }

  private resetLangaugeClicks() {
    this.selectedLanguages = new Set<number>();
    const languageCheckBoxes: HTMLCollection = document.getElementsByClassName("languageCheckBox");

    for(let i = 0; i < languageCheckBoxes.length; i++) {
      var temp      = <HTMLInputElement> languageCheckBoxes.item(i);
      temp.checked  = false;
    }
  }

  private resetSearchBox() {
    this.searchFormControl.setValue("");
  }

  /**
   * RESTORE END
   */

  /**
   * DOWNLOAD BEGIN
   */

  public fireDownload(): void {
    const numbers: number[] = this.getSubmissionIDs();
    this.submissionDownloadService.getDownloadFilesBySubmissionIds(numbers);
  }

  /**
   * DOWNLOAD END
   */

  /**
   * Returns true if filter fires
   * @private
   */
  private scanForInputParameters(): boolean {
    //TODO need?
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
   * RELATED BEGIN
   */

  /**
   * Returns true if filter fires
   * @private
   */
  private scanForRoutingParameters(): boolean {
    //TODO need?
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
    this.submissions.filter((submission: Submission) => {submission.challenge.id == challengeId});
  }

  private getSubmissionsByPLanguageId(pLanguageId: number) {
    this.submissions.filter((submission:Submission) => {submission.language.id == pLanguageId});
  }

  /**
   * RELATED END
   */

  /*
  PAGINATION START
   */

  onChangePage(pageOfitems: Array<any>) {
    this.pageOfItems = pageOfitems;
  }

  private setPage(page: number) {
    this.pager      = paginate(this.submissions.length, page, this.pageSize, this.maxPages);
    var pageOfItems = this.submissions.slice(this.pager.startIndex, this.pager.endIndex +1);
    this.changePage.emit(pageOfItems);
  }

  /*
  PAGINATION END
   */

  /*
  OTHER
   */
  private enableLanguages(size: number): void {
    console.log(this.languages);
    this.enabledLanguages = new Array<boolean>(size);
    if(this.inputLanguageid == -1) {
      this.enabledLanguages.fill(true, 0, size);
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

  private getSubmissionIDs(): number[] {
    const numbers: number[] = [];
    for(let submission of this.submissions) {
      numbers.push(submission.id!);
    }
    return numbers;
  }

  public navigateToListingDetail(submission: Submission): void {
    this.submissionDataService.setSubmission(submission);
    this.router.navigate([`/submission/${submission.id}`]);
  }

  @HostListener("window:resize", ['$event'])
  private onResize(event: { target: { innerWidth: any; }; }) {
    const width = event.target.innerWidth;
    this.setNumberOfPagesInPaginator(width);
  }

  private setNumberOfPagesInPaginator(width?: number) {
    width = (width == undefined) ? window.innerWidth : width;
    console.log(width);
    switch (true) {
      case (width < 450)  : this.maxPages = 3; break;
      case (width < 500)  : this.maxPages = 4; break;
      case (width < 650)  : this.maxPages = 8; break;
      case (width < 1040) : this.maxPages = 9; break;
      default: this.maxPages = 10;
    }
    console.log(`pages: ${this.maxPages}`);
  }
}
