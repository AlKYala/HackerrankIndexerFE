import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {Router} from "@angular/router";
import {RoutingService} from "../../shared/services/RoutingService";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public toggle: boolean;

  public username!: string;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private routerService: RoutingService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.toggle = false;
  }

  ngOnInit(): void {
  }
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  private initUsername() {

  }

  public toggleDropdown() {
    console.log("Toggling");
    this.toggle = !(this.toggle);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  public route(event: Event, path: string) {
    this.routerService.route(path, event);
  }
}
