import { Component, OnInit } from '@angular/core';
import {from, Observable} from "rxjs";
import {HackerrankJSON} from "../../shared/datamodels/HackerrankJSON/model/HackerrankJSON";
import {HackerrrankJSONService} from "../../shared/datamodels/HackerrankJSON/service/HackerrrankJSONService";

@Component({
  selector: 'app-data-reader',
  templateUrl: './data-reader.component.html',
  styleUrls: ['./data-reader.component.css']
})
export class DataReaderComponent implements OnInit {

  constructor(private hackerrankJsonService: HackerrrankJSONService) { }

  ngOnInit(): void {
  }

  public onChange(event: any): void {
    const file: File = event.target.files[0];
    this.fireParseRequest(file);
  }

  private fireParseRequest(hackerrankJsonFile: File) {
    this.hackerrankJsonService.parseHackerrankJSON(hackerrankJsonFile);
  }
}
