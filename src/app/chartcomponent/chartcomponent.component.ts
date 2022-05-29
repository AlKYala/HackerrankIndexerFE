import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LegendPosition} from "@swimlane/ngx-charts";
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {Subscription} from "rxjs";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {switchMap} from "rxjs/operators";
import {Label, MultiDataSet} from "ng2-charts";
import Chart, {ChartPoint, ChartType} from "chart.js";
import {ChartJSData} from "../../shared/datamodels/Chart/ChartJSData";
import {LogInOutService} from "../../shared/services/LogInOutService";
import {PassPercentage} from "../../shared/datamodels/Analytics/models/PassPercentage";

@Component({
  selector: 'app-chartcomponent',
  templateUrl: './chartcomponent.component.html',
  styleUrls: ['./chartcomponent.component.css']
})
export class ChartcomponentComponent implements OnChanges {

  @Input()
  passPercentages             : PassPercentage[]    = null!;

  public show                 : boolean             = false;

  pLanguageUsagePercentageMap : Map<number, number> = new Map<number, number>();

  public labels               : string[]            = [];
  public passedSubmissions    : number[]            = [];
  public numberSubmissions    : number[]            = [];
  public percentagesRounded   : number[]            = [];
  public progressBarClasses   : string[]            = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    this.listenStatisticsChange     (changes);
    this.fillChartData              (this.passPercentages);
  }

  private listenStatisticsChange(changes: SimpleChanges) {
    if(changes['passPercentages'].currentValue) {
      this.show = true;
      this.fillChartData(this.passPercentages);
    }
  }

  private fillChartData(statistics: PassPercentage[]) {
    const colors:             string[]  = [];
    this.emptyChartData();

    for(let i = 0; i < statistics.length; i++) {
      let label: string       = this.getLabelFromStatisticsInstance (statistics[i]);
      let percentage: number  = (statistics[i].passed * 100) / statistics[i].total;

      colors.push                   (statistics[i].planguage.color);

      this.labels.push              (label);
      this.numberSubmissions.push   (statistics[i].total);
      this.passedSubmissions.push   (statistics[i].passed);
      this.percentagesRounded.push  (Math.floor(percentage));
      this.progressBarClasses.push  (this.pickProgressBarClass(percentage));
    }


    const chartDataDataSet =
      [
      {
        label: "",
        data: this.numberSubmissions,
        backgroundColor: colors,
        hoverOffset: 4
      }
    ];

    const chartData: ChartJSData =
      {
        labels: this.labels,
        datasets: chartDataDataSet
      };

    this.renderChart(chartData);
  }

  private getLabelFromStatisticsInstance(statistic: PassPercentage): string {
    return (statistic.planguage.displayName != null) ? statistic.planguage.displayName : statistic.planguage.language;
  }

  public renderChart(chartData: ChartJSData) {
    const canvas  = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx     = canvas.getContext('2d');

    const myChart = new Chart(ctx!,
      {
        type: 'pie',
        data: chartData
      }
    );
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

  private emptyChartData() {
    this.labels             = [];
    this.passedSubmissions  = [];
    this.numberSubmissions  = [];
    this.percentagesRounded = [];
    this.progressBarClasses = [];
  }
}
