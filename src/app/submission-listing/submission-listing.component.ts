import {Component, Input, OnInit} from '@angular/core';
import {Submission} from "../../shared/datamodels/Submission/model/Submission";

@Component({
  selector: 'app-submission-listing',
  templateUrl: './submission-listing.component.html',
  styleUrls: ['./submission-listing.component.css']
})
export class SubmissionListingComponent implements OnInit {

  //! removes strict propery initialization
  @Input() submission!: Submission;

  constructor() { }

  ngOnInit(): void {
  }

}
