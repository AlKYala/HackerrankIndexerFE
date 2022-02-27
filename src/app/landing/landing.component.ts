import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";
import {Subscription} from "rxjs";
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {AuthenticationService} from "../../shared/services/AuthenticationService";
import {Router} from "@angular/router";

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
              private authenticationService: AuthenticationService,
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

  private redirectIfLoggedIn() {
    if(this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/analytics']);
    }
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
