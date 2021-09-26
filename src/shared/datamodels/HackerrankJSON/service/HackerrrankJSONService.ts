import {Injectable} from "@angular/core";
import {from, Observable} from "rxjs";
import {HackerrankJSON} from "../model/HackerrankJSON";
import {HttpClient} from "@angular/common/http";
import {switchMap} from "rxjs/operators";
import {ServiceHandler} from "../../../services/ServiceHandler/ServiceHandler";
import {ServiceHandlerEnum} from "../../../services/ServiceHandler/ServiceHandlerEnum";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HackerrrankJSONService {

  constructor(private httpClient: HttpClient,
              private serviceHandler: ServiceHandler<any>) {
  }

  public fireHackerrankParsing(hackerrankJSONFile: File): Observable<any> {
    return from(hackerrankJSONFile.text()).pipe(switchMap((data: any) => {
      const parsed = JSON.parse(data);
      const hrJSON: HackerrankJSON = {email: parsed.email, username: parsed.username, submissions: parsed.submissions};
      //return this.httpClient.post(`${environment.api}/json`, hrJSON);
      return this.serviceHandler.anyRequest(ServiceHandlerEnum.POST, `${environment.api}/json`, hrJSON);
    })) as Observable<number>;
  }

}
