import {Injectable} from "@angular/core";

@Injectable(
  {providedIn: 'root'}
)
export class SubmissionRoutingService {
  private isRoutedFromAnalytics = false;

  public checkIsRoutedFromAnalytics(): boolean {
    return this.isRoutedFromAnalytics;
  }

  public setIsRoutedFromAnalytics(val: boolean): void {
    this.isRoutedFromAnalytics = val;
  }
}
