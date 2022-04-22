import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-initial-landing',
  templateUrl: './initial-landing.component.html',
  styleUrls: ['./initial-landing.component.css']
})
export class InitialLandingComponent implements OnInit {

  constructor(private router: Router,
              private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.setTokenOrRedirect();
    setTimeout((() => this.stopBlinkingStyle()), 2500); //2500ms is 2.5 s - check typing animation
    setTimeout((() => this.redirectToLanding()), 8000);
  }

  private setTokenOrRedirect() {
    const alreadyVisited = this.localStorageService.retrieve('visited') != undefined;
    if(alreadyVisited) {
      this.redirectToLanding();
    }
    this.localStorageService.store('visited', {});
  }

  private redirectToLanding() {
    this.router.navigate(['/landing']);
  }

  private stopBlinkingStyle() {
    let style = document.getElementById('typing')!.style;
    style.border = '0px';
  }
}
