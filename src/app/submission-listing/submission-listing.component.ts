import {Component, Input, OnInit} from '@angular/core';
import {Submission} from "../../shared/datamodels/Submission/model/Submission";
import {ActivatedRoute, NavigationEnd, NavigationExtras, Router} from "@angular/router";
import {SubmissionDataService} from "../../shared/services/SubmissionDataService";

@Component({
  selector: 'app-submission-listing',
  templateUrl: './submission-listing.component.html',
  styleUrls: ['./submission-listing.component.css']
})
export class SubmissionListingComponent implements OnInit {

  //! removes strict propery initialization
  @Input() submission!: Submission;

  constructor(private router: Router,
              private submissionDataService: SubmissionDataService) { }

  ngOnInit(): void {
  }
}
