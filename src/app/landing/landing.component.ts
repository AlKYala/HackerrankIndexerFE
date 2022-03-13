import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";
import {Subscription} from "rxjs";
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {AuthenticationService} from "../../shared/services/AuthenticationService";
import {Router} from "@angular/router";
import {LogInOutService} from "../../shared/services/LogInOutService";

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

  constructor(
              private analyticsService: AnalyticsService,
              private logInOutService: LogInOutService,
              private localStorageService: LocalStorageService,
              private router: Router) {
    this.loggedIn = false;
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    //TODO check for login - if logged in redirekt to user Interface
    this.redirectIfLoggedIn();
    this.initNumberOfUsers();
    this.initNumberOfSubmissions();
  }

  private async redirectIfLoggedIn() {
    this.logInOutService.checkLoggedIn().then(
      (result: boolean) => {
        if(!result) {
          this.localStorageService.store("isLoggedIn", 0);
          return;
        }
        this.router.navigate(['/analytics']);
        this.localStorageService.store("isLoggedIn", 1);
      }
    )
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
      },
      error => {
        this.numberOfSubmissions = 0;
      })
  }

}
