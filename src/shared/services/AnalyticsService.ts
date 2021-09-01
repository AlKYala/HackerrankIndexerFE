import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UsagePercentages} from "../datamodels/Analytics/models/UsagePercentages";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private path: string = `${environment.api}/analytics`

  constructor(private httpClient: HttpClient) {
  }

  public fireClearStatistics() : Observable<any> {
    return this.httpClient.post(`${this.path}/clear`, null) as Observable<any>;
  }

  public getPercentagePassedSubmissions(): Observable<number> {
    return this.httpClient.get(`${this.path}/submissions/passed`) as Observable<number>;
  }

  public getPercentagePassedChallenges(): Observable<number> {
    return this.httpClient.get(`${this.path}/challenges/passed`) as Observable<number>;
  }

  public getPercentageOfPassedByLanguageId(languageId: number): Observable<number> {
    return this.httpClient.get(`${this.path}/planguage/${languageId}/passed`) as Observable<number>;
  }

  public getUsagePercentagesOfPLanguages(): Observable<UsagePercentages> {
    return this.httpClient.get(`${this.path}/pLanguage/percentages`) as Observable<UsagePercentages>;
  }
}
