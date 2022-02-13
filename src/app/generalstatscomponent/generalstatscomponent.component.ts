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

  constructor(private analyticsService: AnalyticsService) { }

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
        this.generalPercentageObject = data;
        this.initPassClasses(data);
      });
    this.mainSubscription.add(subscription);
  }

  private initPassClasses(data: GeneralPercentage) {
    this.submissionsPassedClass = this.getClassForPercentage(data.percentageSubmissionPassed);
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

  /*
  private initSubmissionsPercentage(): void {
    const subscription: Subscription = this.analyticsService.getPercentagePassedSubmissions()
      .pipe().subscribe((data: number) => {
        this.percentageSubmissionsPassed = Math.round(data*100);
        this.visualizePassedSubmissions();
      })
    this.subscriptions.push(subscription);
  }

  private initChallengesPercentage(): void {
    const subscription: Subscription = this.analyticsService.getPercentagePassedChallenges()
      .pipe().subscribe((data: number) => {
        //debug
        this.percentageChallengesPassed = Math.round(data*100);
        this.visualizePassedChallenges();
      });
    this.subscriptions.push(subscription);
  }


  private initFavouriteLanguage() {
    const subscription = this.analyticsService.getFavouritePLanguage().pipe().subscribe((data: Planguage) => {
      this.favouriteLanguage = data.language;
    });
    this.subscriptions.push(subscription);
  }

  private visualizePassedChallenges() {
    if( document.getElementById("challengesPassedProgress") != null) {
      document.getElementById("challengesPassedProgress")!.style.width = `${this.percentageChallengesPassed}%`;
    }
  }

  private visualizePassedSubmissions() {
    if(document.getElementById("passedSubmissionsPercent") != null) {
      document.getElementById("passedSubmissionsPercent")!.style.width = `${this.percentageSubmissionsPassed}%`;
    }
  }
  */
}
