import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";
import {Subscription} from "rxjs";
import {AnalyticsService} from "../../shared/services/AnalyticsService";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  loggedIn:             boolean;
  numberOfUsers!:       number;
  numberOfSubmissions!: number;
  subscriptions:        Subscription;

  constructor(private localStorageService: LocalStorageService,
              private analyticsService: AnalyticsService) {
    this.loggedIn = false;
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    //TODO check for login - if logged in redirekt to user Interface
    this.initNumberOfUsers();
    this.initNumberOfSubmissions();
  }

  private initNumberOfUsers() {
    const subscription = this.analyticsService.getNumberOfUsers().pipe()
      .subscribe((data: number) => {
      //this.numberOfUsers = data;
        this.numberOfUsers = data;
    });
    this.subscriptions.add(subscription);
  }

  private initNumberOfSubmissions() {
    const subscription = this.analyticsService.getNumberOfSubmissions().pipe()
      .subscribe((data: number) => {
        this.numberOfSubmissions = data;
      })
  }

}
