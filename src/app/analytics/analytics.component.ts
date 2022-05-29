import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {Subscription} from "rxjs";
import {HackerrrankJSONService} from "../../shared/datamodels/HackerrankJSON/service/HackerrrankJSONService";
import {LogInOutService} from "../../shared/services/LogInOutService";
import {Router} from "@angular/router";
import {UserDataService} from "../../shared/services/UserDataService";
import {UserData} from "../../shared/datamodels/User/model/UserData";
import {LocalStorageService} from "ngx-webstorage";
import {GeneralPercentage} from "../../shared/datamodels/Analytics/models/GeneralPercentage";
import {PassPercentage} from "../../shared/datamodels/Analytics/models/PassPercentage";
import {Submission} from "../../shared/datamodels/Submission/model/Submission";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {PaginationWidths} from "../../shared/scss/resizePagination/PaginationWidths";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  /**
   * Used to input user Data
   */
  @Input()
  userDataInput!: UserData;

  private subscriptions!: Subscription[];

  userData!: UserData;
  generalPercentage!: GeneralPercentage;
  passPercentages: PassPercentage[] = null!;
  submissions: Submission[] = [];
  languages: Planguage[] = [];
  userDataToken: string = "";
  challengeNames: string[] = [];

  datafound: boolean = false; //
  wait: boolean = true; //wait for the data to load
  submitted: boolean = false;
  file!: File;
  oldWidth!: PaginationWidths;
  renderSubmissionList: boolean = true;

  constructor(private subscriptionService: SubscriptionService,
              private analyticsService: AnalyticsService,
              private hackerrankJsonService: HackerrrankJSONService,
              private router: Router,
              private logInOutService: LogInOutService,
              private userDataService: UserDataService,
              private localStorageService: LocalStorageService) {
    this.subscriptions = [];
  }

  async ngOnInit() {

    this.oldWidth = this.calculateWidthEnum();

    console.log(this.userData == undefined);
    const checkLogin: boolean = this.userData == undefined;

    console.log(checkLogin);

    if(checkLogin) {
      await this.redirectIfNotLoggedIn();
    }

    await this.loadUserData().finally(() => {
      this.onInit();
    });
  }

  /**
   * A method to redirect the user to the landing page if no login found
   * @private
   */
  private async redirectIfNotLoggedIn() {
    await this.logInOutService.checkLoggedIn().then(
      (result: boolean) => {
        if(!result) {
          this.logInOutService.fireLogOut();
          this.router.navigate(['/landing']);
          return;
        }
      }
    );
  }

  async loadUserData() {
    //TODO error interception when data is not found
    await this.userDataService.loadUserData().then((userData: UserData) => {
      this.userData = userData;
      this.datafound = this.checkDataFound(userData);
    })
  }

  private checkDataFound(userdata: UserData) {
    return userdata.submissionList.length > 0;
  }

  private initImportDataFromUserData(userData: UserData) {
    this.generalPercentage  = userData.generalPercentage;
    this.passPercentages    = userData.passPercentages;
    this.submissions        = userData.submissionList;
    this.languages          = this.extractUsedLanguages(userData.passPercentages);
    this.userDataToken      = this.userData.user.userDataToken;
    this.challengeNames     = this.extractChallengeNames(this.submissions);
  }

  private extractUsedLanguages(passPercentages: PassPercentage[]): Planguage[] {
    const languagesSet: Set<Planguage> = new Set<Planguage>();

    passPercentages.forEach((element: PassPercentage) => languagesSet.add(element.planguage));

    return [...languagesSet];
  }

  /**
   * wraps ngOnInit - fired after logInCheckIsComplete
   */
  private onInit() {
    this.subscriptions = [];
    this.initImportDataFromUserData(this.userData);
    this.initStyleAndStats();
    this.wait = false;
  }

  private getChallengeNames(submissions: Submission[]) {
    let challengeNames: string[] = this.localStorageService.retrieve('challengeNames');
    if(challengeNames == undefined) {
      challengeNames = this.extractChallengeNames(submissions);
      this.localStorageService.store('challengeNames', challengeNames);
    }
    return challengeNames;
  }

  private extractChallengeNames(submissions: Submission[]): string[] {
    const challengeNames: Set<string> = new Set<string>();
    for(const submission of submissions) {
      challengeNames.add(submission.challenge.challengeName);
    }
    return [...challengeNames.values()]
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeParam(this.subscriptions);
  }

  private initStyleAndStats() {
    this.loadJsFile("/assets/bootstrap/js/bootstrap.min.js");
    this.loadJsFile("/assets/js/chart.min.js");
    this.loadJsFile("/assets/js/bs-init.js");
    this.loadJsFile("/assets/js/theme.js");

    this.loadCSSFile("/assets/bootstrap/css/bootstrap.min.css");
    this.loadCSSFile("https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i");
    this.loadCSSFile("/assets/fonts/fontawesome-all.min.css");
    this.loadCSSFile("/assets/fonts/font-awesome.min.css");
    this.loadCSSFile("/assets/fonts/fontawesome5-overrides.min.css");
  }

  public onChange(event: any): void {
    const file: File = event.target.files[0];
    this.file = file;
    this.fireUpload();
  }

  public fireUpload(): void {
    this.submitted = true;
    this.fireParseRequest(this.file);
  }

  private fireParseRequest(hackerrankJsonFile: File) {
    this.wait = true;
    const subscription: Subscription = this.hackerrankJsonService.fireHackerrankParsing(hackerrankJsonFile)
      .pipe().subscribe((response: string) => {
      this.datafound = true;
      this.wait = false;
    });
    this.subscriptions.push(subscription);
  }

  public loadJsFile(url: string) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    ////console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  public loadCSSFile(url: string) {
    let node = document.createElement('link');
    node.href = url;
    node.rel='stylesheet';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  @HostListener("window:resize", ['$event'])
  private onResize(event: { target: { innerWidth: any; }; }) {
    const width = event.target.innerWidth;

    const newWidth = this.calculateWidthEnum();

    if(newWidth.valueOf() != this.oldWidth.valueOf()) {
      this.oldWidth = newWidth;
      this.renderSubmissionList = false;
      this.renderSubmissionList = true;
    }
  }

  private calculateWidthEnum(): PaginationWidths {
    const width = window.innerWidth;
    switch (true) {
      case (width < 450)  : return PaginationWidths.sub450;
      case (width < 500)  : return PaginationWidths.sub450;
      case (width < 650)  : return PaginationWidths.sub450;
      case (width < 1040) : return PaginationWidths.sub450;
      default: return PaginationWidths.fullscreen;
    }
  }
}
