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
import {ChartJSData} from "../../shared/datamodels/Chart/ChartJSData";

@Component({
  selector: 'app-chartcomponent',
  templateUrl: './chartcomponent.component.html',
  styleUrls: ['./chartcomponent.component.css']
})
export class ChartcomponentComponent implements OnInit{



  pLanguageUsagePercentageMap = new Map<number, number>();
  private subscription: Subscription = new Subscription();
  private pLanguages!: Planguage[];

  public labels!: string[];
  public percentage: number[] = [];

  constructor(private analyticsService: AnalyticsService,
              private pLanguageService: PLanguageService) {
  }

  ngOnInit() {
    this.initData();
  }

  private initData(): void {
    this.initChartData()
  }

  private initChartData(): void {
    const subscription = this.analyticsService.getUsagePercentagesOfPLanguages().subscribe((data: UsageStatistics[]) => {
      this.fillChartData(data);
    });
    this.subscription.add(subscription);
  }

  private fillChartData(statistics: UsageStatistics[]) {
    const labels:             string[]  = [];
    const numberSumbissions:  number[]  = [];
    const colors:             string[]  = [];

    for(let i = 0; i < statistics.length; i++)
    {
      labels.push(statistics[i].planguage.language);
      colors.push(statistics[i].planguage.color);
      numberSumbissions.push(statistics[i].total);
      this.percentage.push(statistics[i].percentage * 100); //TODO: find out what is wrong with these values - check in backend
    }

    this.labels = labels;

    const chartDataDataSet = [{label: "", data: numberSumbissions, backgroundColor: colors, hoverOffset: 4}];
    const chartData: ChartJSData = {labels: labels, datasets: chartDataDataSet};

    this.renderChart(chartData);
  }

  public renderChart(chartData: ChartJSData) {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const myChart = new Chart(ctx!, {
      type: 'pie',
      data: chartData
    });
  }
}
