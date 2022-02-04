import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LegendPosition} from "@swimlane/ngx-charts";
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {Subscription} from "rxjs";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {switchMap} from "rxjs/operators";
import {PassPercentages} from "../../shared/datamodels/Analytics/models/PassPercentages";
import {UsageStatistics} from "../../shared/datamodels/Analytics/models/UsageStatistics";
import {Label, MultiDataSet} from "ng2-charts";
import Chart, {ChartPoint, ChartType} from "chart.js";

@Component({
  selector: 'app-chartcomponent',
  templateUrl: './chartcomponent.component.html',
  styleUrls: ['./chartcomponent.component.css']
})
export class ChartcomponentComponent implements OnInit{



  pLanguageUsagePercentageMap = new Map<number, number>();
  private subscriptions!: Subscription[];
  private pLanguages!: Planguage[];

  private labels: string[] = [];
  private percentages!: number [];

  constructor(private analyticsService: AnalyticsService,
              private pLanguageService: PLanguageService) {
  }

  ngOnInit() {
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
    console.log(this.pLanguageUsagePercentageMap);
  }

  private initChart() {
    for(const language of this.pLanguages) {
      const label: string = language.language;
      const share: number | undefined = this.pLanguageUsagePercentageMap.get(language.id!);
      this.labels.push(label);
      this.percentages.push(share!);

      console.log(this.labels);
      console.log(this.percentages);
    }
  }

  public initDummyChart() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const data = {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100, 70,80,110],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };

    const myChart = new Chart(ctx!, {
      type: 'pie',
      data: data
    });
  }

  private initLanguagesUsed() {

  }

}
