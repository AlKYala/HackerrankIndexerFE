import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UsageStatistics} from "../datamodels/Analytics/models/UsageStatistics";
import {Planguage} from "../datamodels/PLanguage/model/PLanguage";
import {PassPercentages} from "../datamodels/Analytics/models/PassPercentages";
import {ServiceHandler} from "./ServiceHandler/ServiceHandler";
import {ServiceHandlerEnum} from "./ServiceHandler/ServiceHandlerEnum";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private path: string = `${environment.api}/analytics`

  constructor(private httpClient: HttpClient,
              private serviceHandler: ServiceHandler<any>) {
  }

  public fireClearStatistics() : Observable<any> {
    //return this.httpClient.post(`${this.path}/clear`, null) as Observable<any>;
    return this.serviceHandler.anyRequest(ServiceHandlerEnum.POST, `${this.path}/clear`, null);
  }

  public getPercentagePassedSubmissions(): Observable<number> {
    //return this.httpClient.get(`${this.path}/submissions/passed`) as Observable<number>;
    return this.serviceHandler
      .anyRequest(ServiceHandlerEnum.GET, `${this.path}/submissions/passed`) as Observable<number>;
  }

  public getPercentagePassedChallenges(): Observable<number> {
    //return this.httpClient.get(`${this.path}/challenges/passed`) as Observable<number>;
    return this.serviceHandler
      .anyRequest(ServiceHandlerEnum.GET, `${this.path}/challenges/passed`) as Observable<number>;
  }

  public getPercentageOfPassedByLanguageId(languageId: number): Observable<number> {
    //return this.httpClient.get(`${this.path}/pLanguage/${languageId}/passed`) as Observable<number>;
    return this.serviceHandler
      .anyRequest(ServiceHandlerEnum.GET, `${this.path}/pLanguage/${languageId}/passed`) as Observable<number>;
  }

  public getUsagePercentagesOfPLanguages(): Observable<UsageStatistics> {
    //return this.httpClient.get(`${this.path}/pLanguage/percentages/usage`) as Observable<UsageStatistics>;
    return this.serviceHandler
      .anyRequest(ServiceHandlerEnum.GET, `${this.path}/pLanguage/percentages/usage`) as Observable<UsageStatistics>;
  }

  public getPassPercentagesOfPLanguages(): Observable<PassPercentages> {
    //return this.httpClient.get(`${this.path}/pLanguage/percentages/passed`) as Observable<PassPercentages>;
    return this.serviceHandler
      .anyRequest(ServiceHandlerEnum.GET, `${this.path}/pLanguage/percentages/passed`) as Observable<any>;
  }

  public getFavouritePLanguage(): Observable<Planguage> {
    //return this.httpClient.get(`${this.path}/pLanguage/favourite`) as Observable<Planguage>;
    return this.serviceHandler
      .anyRequest(ServiceHandlerEnum.GET, `${this.path}/pLanguage/favourite`) as Observable<Planguage>;
  }

  public checkUploadsExist(): Observable<boolean> {
    //return this.httpClient.get(`${this.path}/exists`) as Observable<boolean>;
    return this.serviceHandler
      .anyRequest(ServiceHandlerEnum.GET, `${this.path}/exists`) as Observable<boolean>;
  }
}
