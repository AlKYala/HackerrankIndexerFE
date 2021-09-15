import { Component, OnInit } from '@angular/core';
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {Subscription} from "rxjs";
import {AnalyticsService} from "../../shared/services/AnalyticsService";

@Component({
  selector: 'app-generalstatscomponent',
  templateUrl: './generalstatscomponent.component.html',
  styleUrls: ['./generalstatscomponent.component.css']
})
export class GeneralstatscomponentComponent implements OnInit {

  private subscriptions!: Subscription[];

  percentageSubmissionsPassed!: number;

  percentageChallengesPassed!: number;

  favouriteLanguage: string = "";

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.subscriptions = [];
    this.initData();
  }

  private initData() {
    this.initChallengesPercentage();
    this.initSubmissionsPercentage();
    this.initFavouriteLanguage();
  }

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

}
