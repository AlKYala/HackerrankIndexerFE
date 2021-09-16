import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LegendPosition} from "@swimlane/ngx-charts";
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {Subscription} from "rxjs";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {switchMap} from "rxjs/operators";
import {PassPercentages} from "../../shared/datamodels/Analytics/models/PassPercentages";
import {UsageStatistics} from "../../shared/datamodels/Analytics/models/UsageStatistics";

@Component({
  selector: 'app-chartcomponent',
  templateUrl: './chartcomponent.component.html',
  styleUrls: ['./chartcomponent.component.css']
})
export class ChartcomponentComponent implements OnInit, AfterViewInit {

  chartData: any[] = [];
  chartColors: any = {
    domain : []
  };
  legendPosition: LegendPosition = LegendPosition.Below;

  pLanguageUsagePercentageMap = new Map<number, number>();
  private subscriptions!: Subscription[];
  private pLanguages!: Planguage[];

  constructor(private analyticsService: AnalyticsService,
              private pLanguageService: PLanguageService) { }

  ngOnInit(): void {
    this.subscriptions = [];
  }

  ngAfterViewInit() {
    this.initData();
  }

  private initData(): void {
    const subscription: Subscription = this.pLanguageService
      .findAll()
      .pipe(switchMap((planguages: Planguage[]) => {
      this.pLanguages = planguages;
      return this.analyticsService.getUsagePercentagesOfPLanguages();
    }))
      .subscribe((data: UsageStatistics) => {
      this.initUsagePercentages(data);
      this.initChart();
    })
  }

  private initUsagePercentages(statistics: UsageStatistics): void {
    for(let i = 0; i < statistics.planguages.length; i++) {
      const langaugeId = statistics.planguages[i].id;
      const percentageUsage = statistics.numberSubmissions[i];
      this.pLanguageUsagePercentageMap.set(langaugeId!, percentageUsage);
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
  }

}
