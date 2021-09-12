import {Injectable} from "@angular/core";
import {from, Observable} from "rxjs";
import {HackerrankJSON} from "../model/HackerrankJSON";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HackerrrankJSONService {

  constructor(private httpClient: HttpClient) {
  }

  public fireHackerrankParsing(hackerrankJSONFile: File): Observable<string> {
    return from(hackerrankJSONFile.text()).pipe(switchMap((data: string) => {
      const parsed = JSON.parse(data);
      const hrJSON: HackerrankJSON = {email: parsed.email, username: parsed.username, submissions: parsed.submissions};
      return this.httpClient.post(`${environment.api}/json`, hrJSON);
    })) as Observable<string>;
  }

}
