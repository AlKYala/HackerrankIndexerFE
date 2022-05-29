import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RequestServiceEnum} from "./RequestServiceEnum";
import {Observable} from "rxjs";
import {LocalStorageService} from "ngx-webstorage";
import {Router} from "@angular/router";

//TODO: HTTPSESSIONS

@Injectable({providedIn: 'root'})
export class RequestService {

  constructor(private httpClient: HttpClient,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  public anyRequest(requestServiceEnum: RequestServiceEnum, text: string, payload?: any): Observable<any> {
    switch(requestServiceEnum) {
      case RequestServiceEnum.DELETE: return this.anyDeleteRequest(text);
      case RequestServiceEnum.PUT: return this.anyPutRequest(text, payload);
      case RequestServiceEnum.POST: return this.anyPostRequest(text, payload);
      default: return this.anyGetRequest(text);
    }
  }

  public anyDeleteRequest(text: string): Observable<any> {
    const headers = {"Authorization": this.getJWTHeaderValue(), "userDataId": this.getUserDataIdHeaderValue()};
    return this.httpClient.delete(text, {headers: headers}) as Observable<any>;
  }

  public anyGetRequest(text: string): Observable<any> {
    const headers = {"Authorization": this.getJWTHeaderValue(), "userDataId": this.getUserDataIdHeaderValue()};
    return this.httpClient.get(text, {headers: headers}) as Observable<any>;
  }

  public anyPutRequest(text: string, payload: any): Observable<any> {
    const headers = {"Authorization": this.getJWTHeaderValue(), "userDataId": this.getUserDataIdHeaderValue()};
    return this.httpClient.put(text, payload, {headers: headers}) as Observable<any>;
  }

  public anyPostRequest(text: string, payload: any): Observable<any> {
    const headers = {"Authorization": this.getJWTHeaderValue(), "userDataId": this.getUserDataIdHeaderValue()};
    return this.httpClient.post(text, payload, {headers: headers}) as Observable<any>;
  }

  //TODO ngRX
  private getJWTHeaderValue(): string {
    // intercept here
    let jwt = "";
    try {
      jwt = this.localStorageService.retrieve("jwt").jwt;
    }
    catch (e: Error | any) {
      return "";
    }

    if(jwt !== undefined || jwt !== null) {
      return jwt
    }
    return "";
  }
  //TODO ngRx
  private getUserDataIdHeaderValue(): string {
    return this.localStorageService.retrieve("userDataId");
  }
}
