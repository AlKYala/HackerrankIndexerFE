import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UsageStatistics} from "../datamodels/Analytics/models/UsageStatistics";
import {Planguage} from "../datamodels/PLanguage/model/PLanguage";
import {PLanguageService} from "../datamodels/PLanguage/service/PLanguageService";
import {PassPercentages} from "../datamodels/Analytics/models/PassPercentages";

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
    return this.httpClient.get(`${this.path}/pLanguage/${languageId}/passed`) as Observable<number>;
  }

  public getUsagePercentagesOfPLanguages(): Observable<UsageStatistics> {
    return this.httpClient.get(`${this.path}/pLanguage/percentages/usage`) as Observable<UsageStatistics>;
  }

  public getPassPercentagesOfPLanguages(): Observable<PassPercentages> {
    return this.httpClient.get(`${this.path}/pLanguage/percentages/passed`) as Observable<PassPercentages>;
  }

  public getFavouritePLanguage(): Observable<Planguage> {
    return this.httpClient.get(`${this.path}/pLanguage/favourite`) as Observable<Planguage>;
  }
}
