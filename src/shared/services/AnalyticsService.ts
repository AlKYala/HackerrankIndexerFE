import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

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
}
