import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class AnalyticsComponent implements OnInit, OnDestroy {

  percentageSubmissionsPassed!: number;
  percentageSubmissionsFailed!: number;

  percentageChallengesPassed!: number;
  percentageChallengesFailed!: number;

  usagePercentages!: UsagePercentages;

  private subscriptions!: Subscription[];

  pLanguages!: Planguage[];

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
  }

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
        //debug
        console.log(data);
      this.percentageSubmissionsPassed = data;
      this.percentageSubmissionsFailed = 1 - data;
    })
    this.subscriptions.push(subscription);
  }

  private initChallengesPercentage(): void {
    const subscription: Subscription = this.analyticsService.getPercentagePassedChallenges()
      .pipe().subscribe((data: number) => {
        //debug
        console.log(data);
        this.percentageChallengesPassed = data;
        this.percentageChallengesFailed = 1 - data;
      });
    this.subscriptions.push(subscription);
  }

  private initPercentagePassedByLanguageId(pLanguageId: number) : void {
    const subscription: Subscription = this.analyticsService.getPercentageOfPassedByLanguageId(pLanguageId)
      .pipe().subscribe((data: number) => {
        this.pLanguagePassPercentageMap.set(pLanguageId, data);
      });
    this.subscriptions.push(subscription);
  }

  private initPLanguagesAndUsagePercentages(): void {
    const subscription: Subscription = this.analyticsService.getUsagePercentagesOfPLanguages()
      .pipe().subscribe((data: UsagePercentages) => {
        //debug
        console.log(data);
        this.usagePercentages = data;
      });
    this.subscriptions.push(subscription);
  }

  /**
   * TODO: Prozentsatz fuer maps (passed) per Sprache
   */

  private initUsagePercentages() {
    for(let i = 0; i < this.usagePercentages.pLanguages.length; i++) {
      const langaugeId = this.usagePercentages.pLanguages[i].id;
      const percentageUsage = this.usagePercentages.percentages[i];
      this.pLanguageUsagePercentageMap.set(langaugeId!, percentageUsage);
    }
  }
}
