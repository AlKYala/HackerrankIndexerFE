import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Planguage} from "../datamodels/PLanguage/model/PLanguage";
import {ServiceHandler} from "./ServiceHandler/ServiceHandler";
import {RequestServiceEnum} from "./ServiceHandler/RequestServiceEnum";
import {RequestService} from "./ServiceHandler/RequestService";
import {GeneralPercentage} from "../datamodels/Analytics/models/GeneralPercentage";
import {UserData} from "../datamodels/User/model/UserData";

//TODO bei bedarf die endpunkte anpassen!!!

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private path: string = `${environment.api}/analytics`

  constructor(private httpClient: HttpClient,
              private requestService: RequestService) {
  }

  public getNumberOfUsers(): Observable<number> {
    return this.requestService
      .anyRequest(RequestServiceEnum.GET, `${this.path}/numberUsers`) as Observable<number>;
  }

  public getNumberOfSubmissions(): Observable<number> {
    return this.requestService
      .anyRequest(RequestServiceEnum.GET, `${this.path}/numberSubmissions`) as Observable<number>;
  }
}
