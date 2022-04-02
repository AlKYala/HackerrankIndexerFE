import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {UsageStatistics} from "../../shared/datamodels/Analytics/models/UsageStatistics";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {Subscription} from "rxjs";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {switchMap} from "rxjs/operators";
import {PassPercentages} from "../../shared/datamodels/Analytics/models/PassPercentages";
import {LegendPosition} from "@swimlane/ngx-charts";
import {HackerrrankJSONService} from "../../shared/datamodels/HackerrankJSON/service/HackerrrankJSONService";
import Chart from "chart.js";
import {LogInOutService} from "../../shared/services/LogInOutService";
import {Route, Router} from "@angular/router";
import {UserDataService} from "../../shared/services/UserDataService";
import {UserData} from "../../shared/datamodels/User/model/UserData";
import {LocalStorageService} from "ngx-webstorage";
import {GeneralPercentage} from "../../shared/datamodels/Analytics/models/GeneralPercentage";
import {load} from "@syncfusion/ej2-angular-charts";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {


  private subscriptions!: Subscription[];

  userData!: UserData;
  generalPercentage!: GeneralPercentage;

  datafound: boolean = false; //
  wait: boolean = true; //wait for the data to load
  submitted: boolean = false;
  file!: File;

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
    console.log("First")
    await this.logInOutService.checkLoggedIn().then(
      (result: boolean) => {
        if(!result) {
          this.logInOutService.fireLogOut();
          console.log("should navigate");
          this.router.navigate(['/landing']);
          return;
        }
        console.log("Logged in");
      }
    );
    console.log("Second");
    await this.loadUserData().finally(() => {
      this.onInit();
    });
  }

  async loadUserData() {

    if(this.localStorageService.retrieve("userData")) {
      this.userData = this.localStorageService.retrieve("userData");
      console.log("localStorageFound");
      return;
    }

    await this.userDataService.loadUserData().then((userData: UserData) => {
      this.userData = userData;
      console.log(userData);
      //this.localStorageService.store("userData", userData); //TODO find a way to store more memory in localStorage
    })
  }

  private initImportDataFromUserData(userData: UserData) {
    this.generalPercentage = userData.user.generalPercentage;
    console.log(this.generalPercentage);
  }

  /**
   * wraps ngOnInit - fired after logInCheckIsComplete
   * @private
   */
  private onInit() {
    this.subscriptions = [];
    this.initImportDataFromUserData(this.userData);
    this.checkIsUploadedAlready();
    this.initStyleAndStats();
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

  private checkIsUploadedAlready(): void {
    const subscription: Subscription = this.analyticsService.checkUploadsExist()
      .pipe().subscribe((data: boolean) => {
        this.datafound = data;
        this.wait = false;
        console.log(this.wait);
        console.log(this.datafound);
      })
    this.subscriptions.push(subscription);
  }

  public loadJsFile(url: string) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    console.log(node);
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  public loadCSSFile(url: string) {
    let node = document.createElement('link');
    node.href = url;
    node.rel='stylesheet';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
