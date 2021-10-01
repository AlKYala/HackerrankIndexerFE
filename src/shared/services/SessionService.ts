import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Subscription} from "rxjs";

@Injectable({providedIn: 'root'})
export class SessionService {

  private sessionId!: number;

  constructor(private httpClient: HttpClient) {
    if(this.sessionId == undefined) {
      this.retrieveSessionId();
    }
  }

  public getSessionId() {
    return this.sessionId;
  }

  private retrieveSessionId(): void {
    const subscription: Subscription = this.httpClient.get(`${environment.api}/session/getId`)
      .pipe()
      .subscribe((data: any) => {
        this.sessionId = data;
      })
  }
}
