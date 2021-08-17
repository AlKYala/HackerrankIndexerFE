import {Injectable} from "@angular/core";
import {from, Observable} from "rxjs";
import {HackerrankJSON} from "../model/HackerrankJSON";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HackerrrankJSONService {

  constructor(private httpClient: HttpClient) {
  }

  public parseHackerrankJSON(hackerrankJsonFile: File)  {
    from(hackerrankJsonFile.text()).subscribe((data: string) => {
      const parsed = JSON.parse(data);
      const hrJSON: HackerrankJSON = {email: parsed.email, username: parsed.username, submissions: parsed.submissions};
      //debug
      console.log(hrJSON);
      this.httpClient.post(`${environment.api}/json`, hrJSON).pipe().subscribe((data) => {
        console.log(data);
      });
    });
  }

}
