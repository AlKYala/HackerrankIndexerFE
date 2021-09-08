import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {UsagePercentages} from "../../shared/datamodels/Analytics/models/UsagePercentages";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {Subscription} from "rxjs";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";

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

  constructor(private analyticsService: AnalyticsService,
              private subscriptionService: SubscriptionService,
              private pLanguageService: PLanguageService) { }



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
    this.initChallengesPercentage();
    this.initSubmissionsPercentage();
    this.initPLanguagesAndUsagePercentages();
    this.initPLanguages();
    this.initFavouriteLanguage();
  }

  ngAfterViewChecked(): void {
    this.visualizeData();
  }
  /**initialize P Langauges
   *
   * @private
   */
  private initPLanguages() {
    this.pLanguageService.findAll().pipe().subscribe((data: Planguage[]) => {
      this.pLanguages = data;
      this.loaded = true;
      for(let pLanguage of data) {
        this.initPercentagePassedByLanguageId(pLanguage.id!);
      }
    });
  }

  private initSubmissionsPercentage(): void {
    const subscription: Subscription = this.analyticsService.getPercentagePassedSubmissions()
      .pipe().subscribe((data: number) => {
      this.percentageSubmissionsPassed = Math.round(data*100);
    })
    this.subscriptions.push(subscription);
  }

  private initChallengesPercentage(): void {
    const subscription: Subscription = this.analyticsService.getPercentagePassedChallenges()
      .pipe().subscribe((data: number) => {
        //debug
        this.percentageChallengesPassed = Math.round(data*100);
      });
    this.subscriptions.push(subscription);
  }

  private initPercentagePassedByLanguageId(pLanguageId: number) : void {
    const subscription: Subscription = this.analyticsService.getPercentageOfPassedByLanguageId(pLanguageId)
      .pipe().subscribe((data: number) => {
        this.pLanguagePassPercentageMap.set(pLanguageId, Math.round(data*100));
      });
    this.subscriptions.push(subscription);
  }

  private initPLanguagesAndUsagePercentages(): void {
    const subscription: Subscription = this.analyticsService.getUsagePercentagesOfPLanguages()
      .pipe().subscribe((data: UsagePercentages) => {
        this.usagePercentages = data;
      });
    this.subscriptions.push(subscription);
  }

  private initUsagePercentages() {
    for(let i = 0; i < this.usagePercentages.pLanguages.length; i++) {
      const langaugeId = this.usagePercentages.pLanguages[i].id;
      const percentageUsage = this.usagePercentages.percentages[i];
      this.pLanguageUsagePercentageMap.set(langaugeId!, percentageUsage);
    }
  }

  private initFavouriteLanguage() {
    const subscription = this.analyticsService.getFavouritePLanguage().pipe().subscribe((data: Planguage) => {
      this.favouriteLanguage = data;
    });
    this.subscriptions.push(subscription);
  }



  private visualizeData() {
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
}
