import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  loggedIn: boolean = false;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    //TODO check for login
  }

}
