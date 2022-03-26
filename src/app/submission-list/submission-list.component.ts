import {Component, Input, OnDestroy, OnInit, EventEmitter} from '@angular/core';
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

  @Input()
  submissionInput!: Submission[]; //TODO if not null override

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

  private isFilterFired: boolean;

  constructor(private httpClient: HttpClient,
              private submissionService: SubmissionService,
              private submissionDataService: SubmissionDataService,
              private route: ActivatedRoute,
              private pLanguageService: PLanguageService,
              private challengeService: ChallengeService,
              private router: Router,
              private logInOutService: LogInOutService,
              private requestService: RequestService,
              private submissionDownloadService: SubmissionDownloadService,
              private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {
    this.mainSubscription   = new Subscription();
    this.selectedLanguages  = new Set<number>();
    this.isFilterFired = true;
  }

  async ngOnInit() {
    await this.logInOutService.checkLoggedIn().then((result: boolean) => {
      if(!result) {
        return;
      }
      //STUFF
      this.scanForFilter();
      this.initLanguages();
    })
  }

  ngOnDestroy(): void {
  }

  public filterSubmissionsByName() {
    const search = this.searchFormControl.value;
    if(search == null || search.length == 0) {
      return;
    }
    this.submissions = this.submissionsBackup.filter(submission => submission.challenge.challengeName.includes(search));
    this.pageOfItems = this.submissions;
  }

  public clickLanguage(pLanguage: Planguage): void {

    this.isFilterFired = false;

    const id: number = pLanguage.id!;
    if(this.selectedLanguages.has(id)) {
      this.selectedLanguages.delete(id);
      return;
    }

    this.selectedLanguages.add(id);
  }

  public async fireLanguageFilter() {

    this.isFilterFired = true;

    this.submissions = this.submissionsBackup;

    const filterRequest: FilterRequest = this.createFilterRequest();

    let arr: number[] = [];
    Object.assign(arr, filterRequest.languageIDs);


    if(filterRequest.languageIDs.length == 0 && filterRequest.mode == 4) {

      this.filterSubmissionsByName();
      return;
    }

    await this.submissionService.findWithFilterRequest(filterRequest).toPromise()
      .then((data) => {
        this.submissions = data;
        console.log("data loaded");
      });
  }

  public checkOnlyPassedSubmissions() {

    this.isFilterFired = false;

    if(this.onlyPassedSubmissions) {
      this.onlyPassedSubmissions = false;
      return;
    }
    this.onlyFailedSubmissions = false;
    this.onlyLastPassedSubmissions = false;
    this.onlyPassedSubmissions = true;
  }

  public checkOnlyFailedSubmissions() {

    this.isFilterFired = false;

    if(this.onlyFailedSubmissions) {
      this.onlyFailedSubmissions = false;
      return;
    }
    this.onlyFailedSubmissions = true;
    this.onlyLastPassedSubmissions = false;
    this.onlyPassedSubmissions = false;
  }

  public checkOnlyLastPassedSubmissions() {

    this.isFilterFired = false;

    if(this.onlyLastPassedSubmissions) {
      this.onlyLastPassedSubmissions = false;
      return;
    }
    this.onlyFailedSubmissions = false;
    this.onlyLastPassedSubmissions = true;
    this.onlyPassedSubmissions = false;
  }

  public restoreSubmissions() {
    this.isFilterFired = true;
    this.resetSearchBox();
    this.resetButtonClicks();
    this.submissions = this.submissionsBackup;
  }

  public fireDownload(): void {

    /* TODO: Pruefen ob man nicht eine warnmeldung anzeigen soll */

    let filterFirst: boolean = false;

    if(!this.isFilterFired) {
      this.runConfirmDialog();
      return;
    }

    const numbers: number[] = this.getSubmissionIDs();
    this.submissionDownloadService.getDownloadFilesBySubmissionIds(numbers);
  }

  private filterAndDownload() {
    //wait for request to finish
    this.filterSubmissionsByName();
    this.fireLanguageFilter()
      .then(() => {
        const numbers: number[] = this.getSubmissionIDs();
        this.submissionDownloadService.getDownloadFilesBySubmissionIds(numbers);
      });
  }

  private runConfirmDialog() {
    let options = {
      title: 'Do you want to filter first before you download?',
      confirmLabel: 'Yes',
      declineLabel: 'No - Download anyway'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.filterAndDownload();
      } else {
        const numbers: number[] = this.getSubmissionIDs();
        this.submissionDownloadService.getDownloadFilesBySubmissionIds(numbers);
      }
    });
  }

  private resetButtonClicks() {
    this.resetLangaugeClicks();
    this.resetModeButtonClicks();
  }

  private resetModeButtonClicks() {
    this.onlyLastPassedSubmissions = false;
    this.onlyFailedSubmissions = false;
    this.onlyPassedSubmissions = false;
  }

  private resetLangaugeClicks() {
    this.selectedLanguages = new Set<number>();
    const languageCheckBoxes: HTMLCollection = document.getElementsByClassName("languageCheckBox");

    for(let i = 0; i < languageCheckBoxes.length; i++) {
      var temp = <HTMLInputElement> languageCheckBoxes.item(i);
      temp.checked = false;
    }
  }

  private resetSearchBox() {
    this.searchFormControl.setValue("");
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

  private createFilterRequest(): FilterRequest {
    return {mode: this.getFilterMode(), languageIDs: this.setToArray(this.selectedLanguages)};
  }

  private setToArray(nums: Set<number>): number[] {
    const numArray: number[] = [];
    for(let num of nums.values()) {
      numArray.push(num);
    }
    return numArray;
  }

  private getFilterMode(): number {
    switch (true) {
      case (this.onlyPassedSubmissions): return 1;
      case (this.onlyFailedSubmissions): return 2;
      case (this.onlyLastPassedSubmissions): return 3;
      default: return 4;
    }
  }

  private getSubmissionIDs(): number[] {
    const numbers: number[] = [];
    for(let submission of this.submissions) {
      numbers.push(submission.id!);
    }
    return numbers;
  }
}
