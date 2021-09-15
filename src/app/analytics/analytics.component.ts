import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {UsageStatistics} from "../../shared/datamodels/Analytics/models/UsageStatistics";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {Subscription} from "rxjs";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {switchMap} from "rxjs/operators";
import {PassPercentages} from "../../shared/datamodels/Analytics/models/PassPercentages";
import {LegendPosition} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy, AfterViewChecked {


  private subscriptions!: Subscription[];

  pLanguages!: Planguage[];



  loaded: boolean = false;

  chartData: any[] = [];
  chartColors: any = {
    domain : []
  };
  legendPosition: LegendPosition = LegendPosition.Below;

  langaugesLoaded: boolean = false;
  chartLoaded: boolean = false;
  visualsLoaded: boolean = false;
  favoriteLanguagedLoaded: boolean = false;
  submissionsPercentageLoaded: boolean = false;
  challengesPercentageLoaded: boolean = false;


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
    this.initPLanguages();
  }

  ngAfterViewChecked(): void {
    this.initVisualizations();
  }

  private initVisualizations() {
    if(this.pLanguages !== undefined) {
      this.visualizeLanguagePercentage();
    }
  }

  /**
   * ONE DIMENSIONAL SUBSCRIPTIONS START
   *
   */


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
      })).pipe(switchMap((data: UsageStatistics) => {
        this.initUsagePercentages(data);

        return this.analyticsService.getPassPercentagesOfPLanguages();
    })).subscribe((data: PassPercentages) => {
      this.initPassPercentages(data);
      this.initChart();
    });
    this.subscriptions.push(subscription);
  }

  /*
  }*/

  /**
   * NO SUBSCRIPTIONS DOWN HERE
   */

  private initUsagePercentages(statistics: UsageStatistics): void {
    for(let i = 0; i < statistics.planguages.length; i++) {
      const langaugeId = statistics.planguages[i].id;
      const percentageUsage = statistics.numberSubmissions[i];
      this.pLanguageUsagePercentageMap.set(langaugeId!, percentageUsage);
    }
  }

  private initPassPercentages(percentages: PassPercentages): void {
    for(let i = 0; i < percentages.planguages.length; i++) {
      const languageId = percentages.planguages[i].id;
      const percentagePass = percentages.percentages[i];
      this.pLanguagePassPercentageMap.set(languageId!, Math.round(percentagePass * 100));
    }
  }

  private visualizeLanguagePercentage() {
    for(const language of this.pLanguages) {
      if(document.getElementById(`${language.language.concat('percentageId')}`) != null) {
        const percentage = this.pLanguagePassPercentageMap.get(language.id!);
        console.log(`${language.language} ${language.color}`);
        document.getElementById(`${language.language.concat('percentageId')}`)!.style.width = `${percentage!}%`;
        document.getElementById(`${language.language.concat('percentageId')}`)!.style.backgroundColor = `${language.color}`;
      }
    }
  }

  private initChart() {
    for(const language of this.pLanguages) {
      const color: string = language.color;
      const label: string = language.language;
      const share: number | undefined = this.pLanguageUsagePercentageMap.get(language.id!);
      console.log(`${label}, ${share}`);
      this.chartData.push({name: label, value: share!});
      this.chartColors.domain.push(color);
    }
    this.chartLoaded = true;
    this.fireCheckEverythingLoaded();
  }

  private fireCheckEverythingLoaded() {
    this.loaded =
      this.chartLoaded
      && this.langaugesLoaded;
    console.log(`${this.favoriteLanguagedLoaded} ${this.submissionsPercentageLoaded}
    ${this.challengesPercentageLoaded} ${this.langaugesLoaded}`);
  }
}

export interface colorScheme {
  domain: string[];
}
