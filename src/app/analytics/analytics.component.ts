import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {UsagePercentages} from "../../shared/datamodels/Analytics/models/UsagePercentages";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {Subscription} from "rxjs";

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

  constructor(private analyticsService: AnalyticsService,
              private subscriptionService: SubscriptionService) { }



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
    this.initPLanguageUsagePercentages();
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
      });
  }

  private initPLanguageUsagePercentages(): void {
    const subscription: Subscription = this.analyticsService.getUsagePercentagesOfPLanguages()
      .pipe().subscribe((data: UsagePercentages) => {
        //debug
        console.log(data);
        this.usagePercentages = data;
      });
    this.subscriptions.push(subscription);
  }

}
