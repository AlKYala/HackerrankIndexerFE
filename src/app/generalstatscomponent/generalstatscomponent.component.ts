import { Component, OnInit } from '@angular/core';
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {Subscription} from "rxjs";
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {GeneralPercentage} from "../../shared/datamodels/Analytics/models/GeneralPercentage";
import {GetEntryPointResult} from "@angular/compiler-cli/ngcc/src/packages/entry_point";

@Component({
  selector: 'app-generalstatscomponent',
  templateUrl: './generalstatscomponent.component.html',
  styleUrls: ['./generalstatscomponent.component.css']
})
export class GeneralstatscomponentComponent implements OnInit {

  private mainSubscription!: Subscription;
  generalPercentageObject!: GeneralPercentage;

  challengesPassedClass: string = "";
  submissionsPassedClass: string = "";

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
    this.mainSubscription = new Subscription();
    this.initData();
  }

  private initData() {
    this.initGeneralPercentages();
  }

  private initGeneralPercentages() {
    const subscription: Subscription = this.analyticsService.getGeneralPercentages()
      .subscribe((data: GeneralPercentage) => {
        console.log(data);
        this.assignGeneralPercentagesObject(data);
        this.initPassClasses(data);
      });
    this.mainSubscription.add(subscription);
  }

  private assignGeneralPercentagesObject(instance: GeneralPercentage) {
    this.generalPercentageObject = instance;
    this.generalPercentageObject.percentageSubmissionsPassed =
      Math.floor(this.generalPercentageObject.percentageSubmissionsPassed);
    this.generalPercentageObject.percentageChallengesSolved =
      Math.floor(this.generalPercentageObject.percentageChallengesSolved);
  }

  private initPassClasses(data: GeneralPercentage) {
    this.submissionsPassedClass = this.getClassForPercentage(data.percentageSubmissionsPassed);
    this.challengesPassedClass = this.getClassForPercentage(data.percentageChallengesSolved);
  }

  private getClassForPercentage(percentage: number): string {
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
