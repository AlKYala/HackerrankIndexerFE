import { Component, OnInit } from '@angular/core';
import {from, Observable} from "rxjs";
import {HackerrankJSON} from "../../shared/datamodels/HackerrankJSON/model/HackerrankJSON";
import {HackerrrankJSONService} from "../../shared/datamodels/HackerrankJSON/service/HackerrrankJSONService";
import {Router} from "@angular/router";
import {AnalyticsService} from "../../shared/services/AnalyticsService";

@Component({
  selector: 'app-data-reader',
  templateUrl: './data-reader.component.html',
  styleUrls: ['./data-reader.component.css']
})
export class DataReaderComponent implements OnInit {

  wait: boolean = false;
  file!: File;

  constructor(private hackerrankJsonService: HackerrrankJSONService,
              private analyticsService: AnalyticsService,
              private router: Router) { }

  ngOnInit(): void {
  }

  public onChange(event: any): void {
    const file: File = event.target.files[0];
    this.file = file;
  }

  public fireUpload(): void {
    this.fireParseRequest(this.file);
  }

  public fireClear() {
    this.analyticsService.fireClearStatistics();
  }

  private fireParseRequest(hackerrankJsonFile: File) {
    this.wait = true;
    this.hackerrankJsonService.fireHackerrankParsing(hackerrankJsonFile).pipe().subscribe((response: string) => {
    });
  }
}
