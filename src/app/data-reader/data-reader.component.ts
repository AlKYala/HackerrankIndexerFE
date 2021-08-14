import { Component, OnInit } from '@angular/core';
import {from, Observable} from "rxjs";
import {HackerrankJSON} from "../../shared/datamodels/HackerrankJSON/model/HackerrankJSON";
import {Submission} from "../../shared/datamodels/Submission/model/Submission";
import {SubmissionBeforeProcessing} from "../../shared/datamodels/Submission/model/SubmissionJSON";

@Component({
  selector: 'app-data-reader',
  templateUrl: './data-reader.component.html',
  styleUrls: ['./data-reader.component.css']
})
export class DataReaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public onChange(event: any): void {
    const file: File = event.target.files[0];
    this.parseHackerrankJSON(file);
  }

  private parseHackerrankJSON(hackerrankJsonFile: File) {
    from(hackerrankJsonFile.text()).subscribe((data: string) => {
      const parsed = JSON.parse(data);
      const hrJSON: HackerrankJSON = {email: parsed.email, username: parsed.username, submissions: parsed.submissions};
    });
  }
}
