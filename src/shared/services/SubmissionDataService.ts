import {Injectable} from "@angular/core";
import {Submission} from "../datamodels/Submission/model/Submission";

/**
 * Obsolete
 */
@Injectable({
  providedIn: 'root'
})
export class SubmissionDataService {

  private submission!: Submission;

  constructor() {
  }

  public setSubmission(submission: Submission) {
    this.submission = submission;
  }

  public getSubmission(): Submission {
    return this.submission;
  }
}
