import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {UsagePercentages} from "../../shared/datamodels/Analytics/models/UsagePercentages";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {Observable, Subscription} from "rxjs";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {PLanguageColorPickerService} from "../../shared/services/PLanguageColorPicker";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy, AfterViewChecked {

  percentageSubmissionsPassed!: number;

  percentageChallengesPassed!: number;

  usagePercentages!: UsagePercentages;

  private subscriptions!: Subscription[];

  pLanguages!: Planguage[];

  favouriteLanguage!: Planguage;

  loaded: boolean = false;

  langaugesLoaded: boolean = false;
  colorsLoaded: boolean = false;
  visualsLoaded: boolean = false;
  favoriteLanguagedLoaded: boolean = false;
  submissionsPercentageLoaded: boolean = false;
  challengesPercentageLoaded: boolean = false;


  constructor(private analyticsService: AnalyticsService,
              private subscriptionService: SubscriptionService,
              private pLanguageService: PLanguageService,
              public pLanguageColorPickerService: PLanguageColorPickerService) { }



  pLanguageUsagePercentageMap = new Map<number, number>();
  pLanguagePassPercentageMap = new Map<number, number>();

  ngOnInit(): void {
    this.subscriptions = [];
    this.initData();
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeParam(this.subscriptions);
  }

  private initData(): void {
    this.initPLanguages();
    this.initSubmissionsPercentage();
    this.initChallengesPercentage();
    this.initFavouriteLanguage();
  }

  ngAfterViewChecked(): void {
  }


  /**
   * ONE DIMENSIONAL SUBSCRIPTIONS START
   *
   */


  private initSubmissionsPercentage(): void {
    const subscription: Subscription = this.analyticsService.getPercentagePassedSubmissions()
      .pipe().subscribe((data: number) => {
      this.percentageSubmissionsPassed = Math.round(data*100);
      this.submissionsPercentageLoaded = true;
      this.fireCheckEverythingLoaded();
    })
    this.subscriptions.push(subscription);
  }

  private initChallengesPercentage(): void {
    const subscription: Subscription = this.analyticsService.getPercentagePassedChallenges()
      .pipe().subscribe((data: number) => {
        //debug
        this.percentageChallengesPassed = Math.round(data*100);
        this.submissionsPercentageLoaded = true;
        this.fireCheckEverythingLoaded();
      });
    this.subscriptions.push(subscription);
  }

  private initFavouriteLanguage() {
    const subscription = this.analyticsService.getFavouritePLanguage().pipe().subscribe((data: Planguage) => {
      this.favouriteLanguage = data;
      this.favoriteLanguagedLoaded = true;
      this.fireCheckEverythingLoaded();
    });
    this.subscriptions.push(subscription);
  }

  /**
   * ONE DIMENSIONAL SUBSCRIPTIONS END
   */

  /**
   * load languages first
   * then iterate over languages -
   * load percentage for each
   *
   * noodle
   * @private
   */
  private initPLanguages() {
    const subscription: Subscription =this.pLanguageService.findAll().pipe().subscribe((data: Planguage[]) => {
      this.pLanguages = data;
      this.langaugesLoaded = true;
    });
    this.pLanguageService.findAll()
      .pipe(switchMap((data: Planguage[]) => {
        this.pLanguages = data;
        return this.analyticsService.getUsagePercentagesOfPLanguages();
      })).pipe(switchMap((data: UsagePercentages) => {
        this.initUsagePercentages(data);
        return new Observable<any>();
    })).subscribe(() => {
      this.initPercentagesOfAllLanguages();
    });
    this.subscriptions.push(subscription);
  }

  private initPercentagesOfAllLanguages() {
    for(const pLanguage of this.pLanguages) {
      this.initPercentagePassedByLanguageId(pLanguage.id!);
    }
  }

  private initPercentagePassedByLanguageId(pLanguageId: number) : void {
    const subscription: Subscription = this.analyticsService.getPercentageOfPassedByLanguageId(pLanguageId)
      .pipe().subscribe((data: number) => {
        this.pLanguagePassPercentageMap.set(pLanguageId, Math.round(data*100));
      });
    this.subscriptions.push(subscription);
  }

  /*
  }*/

  /**
   * NO SUBSCRIPTIONS DOWN HERE
   */

  private initUsagePercentages(percentages: UsagePercentages): void {
    for(let i = 0; i < percentages.planguages.length; i++) {
      console.log(i);
      const langaugeId = percentages.planguages[i].id;
      const percentageUsage = percentages.usagePercentages[i];
      this.pLanguageUsagePercentageMap.set(langaugeId!, percentageUsage);
    }
  }

  private visualizeHeader() {
    if( document.getElementById("challengesPassedProgress") != null) {
      document.getElementById("challengesPassedProgress")!.style.width = `${this.percentageChallengesPassed}%`;
    }
    if(document.getElementById("passedSubmissionsPercent") != null) {
      document.getElementById("passedSubmissionsPercent")!.style.width = `${this.percentageSubmissionsPassed}%`;
    }
    this.visualizeLanguagePercentage();
  }

  private visualizeLanguagePercentage() {
    for(const langauge of this.pLanguages) {
      if(document.getElementById(`${langauge.language.concat('percentageId')}`) != null) {
        const percentage = this.pLanguagePassPercentageMap.get(langauge.id!);
        document.getElementById(`${langauge.language.concat('percentageId')}`)!.style.width = `${percentage}%`;
      }
    }
  }

  private fireCheckEverythingLoaded() {
    this.loaded = this.favoriteLanguagedLoaded
      && this.submissionsPercentageLoaded
      && this.challengesPercentageLoaded
      && this.langaugesLoaded;
  }
}
