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
import {LogInOutService} from "../../shared/services/LogInOutService";

@Component({
  selector: 'app-chartcomponent',
  templateUrl: './chartcomponent.component.html',
  styleUrls: ['./chartcomponent.component.css']
})
export class ChartcomponentComponent implements OnInit{

  pLanguageUsagePercentageMap = new Map<number, number>();
  private subscription: Subscription = new Subscription();

  public labels             : string[];
  public passedSubmissions  : number[];
  public numberSubmissions  : number[];
  public percentagesRounded : number[];
  public progressBarClasses : string[];

  constructor(private analyticsService: AnalyticsService,
              private logInOutService: LogInOutService,
              private pLanguageService: PLanguageService) {
    this.labels = [];
    this.passedSubmissions = [];
    this.numberSubmissions = [];
    this.percentagesRounded = [];
    this.progressBarClasses = [];
  }

  async ngOnInit() {
    await this.logInOutService.checkLoggedIn().then((result: boolean) => {
      if(!result) {
        return;
      }
      this.initData();
    })
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
    const colors:             string[]  = [];

    console.log(statistics);

    for(let i = 0; i < statistics.length; i++)
    {

      let label = this.getLabelFromStatisticsInstance(statistics[i]);
      this.labels.push(label);
      colors.push(statistics[i].planguage.color);
      this.numberSubmissions.push(statistics[i].totalSubmissions);
      this.passedSubmissions.push(statistics[i].passedSubmissions);
      let percentage: number = (statistics[i].passedSubmissions * 100) / statistics[i].totalSubmissions;
      this.percentagesRounded.push(Math.floor(percentage));
      this.progressBarClasses.push(this.pickProgressBarClass(percentage));
    }


    console.log(this.numberSubmissions);
    console.log(this.passedSubmissions);
    console.log(this.percentagesRounded);

    const chartDataDataSet = [{label: "", data: this.numberSubmissions, backgroundColor: colors, hoverOffset: 4}];
    const chartData: ChartJSData = {labels: this.labels, datasets: chartDataDataSet};

    this.renderChart(chartData);
  }

  private getLabelFromStatisticsInstance(statistic: UsageStatistics): string {
    return (statistic.planguage.displayName != null) ? statistic.planguage.displayName : statistic.planguage.language;
  }

  public renderChart(chartData: ChartJSData) {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const myChart = new Chart(ctx!, {
      type: 'pie',
      data: chartData
    });
  }

  private pickProgressBarClass(percentage: number): string {
    switch(true) {
      case (percentage > 80): return "progress-bar bg-success progress-bar-striped progress-bar-animated";
      case (percentage > 65): return "progress-bar bg-primary progress-bar-striped progress-bar-animated";
      case (percentage > 50): return "progress-bar bg-secondary progress-bar-striped progress-bar-animated";
      case (percentage > 35): return "progress-bar bg-dark progress-bar-striped progress-bar-animated";
      case (percentage > 20): return "progress-bar bg-warning progress-bar-striped progress-bar-animated";
      default:                return "progress-bar bg-danger progress-bar-striped progress-bar-animated";
    }
  }
}
