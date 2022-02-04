import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RequestServiceEnum} from "./RequestServiceEnum";
import {Observable} from "rxjs";
import {LocalStorageService} from "ngx-webstorage";

//TODO: HTTPSESSIONS

@Injectable({providedIn: 'root'})
export class RequestService {

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {
  }

  public anyRequest(requestServiceEnum: RequestServiceEnum, text: string, payload?: any): Observable<any> {
    switch(requestServiceEnum) {
      case RequestServiceEnum.DELETE: return this.anyDeleteRequest(text);
      case RequestServiceEnum.PUT: return this.anyPutRequest(text, payload);
      case RequestServiceEnum.POST: return this.anyPostRequest(text, payload);
      default: return this.anyGetRequest(text);
    }
  }

  private anyDeleteRequest(text: string): Observable<any> {
    const header = this.getJWTHeader();
    return this.httpClient.delete(text, {headers: {"Authorization": header}}) as Observable<any>;
  }

  private anyGetRequest(text: string): Observable<any> {
    const header = this.getJWTHeader();
    return this.httpClient.get(text, {headers: {"Authorization": header}}) as Observable<any>;
  }

  private anyPutRequest(text: string, payload: any): Observable<any> {
    const header = this.getJWTHeader();
    return this.httpClient.put(text, payload, {headers: {"Authorization": header}}) as Observable<any>;
  }

  private anyPostRequest(text: string, payload: any): Observable<any> {
    const header = this.getJWTHeader();
    return this.httpClient.post(text, payload, {headers: {"Authorization": header}}) as Observable<any>;
  }

  private getJWTHeader() {
    const jwt = this.localStorageService.retrieve("jwt").jwt;
    if(jwt !== undefined || jwt !== null) {
      return jwt
    }
    return "";
  }
}
