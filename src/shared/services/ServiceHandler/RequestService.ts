import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RequestServiceEnum} from "./RequestServiceEnum";
import {Observable} from "rxjs";

//TODO: HTTPSESSIONS

@Injectable({providedIn: 'root'})
export class RequestService {

  constructor(private httpClient: HttpClient) {
  }

  public anyRequest(requestServiceEnum: RequestServiceEnum, text: string, payload?: any): Observable<any> {
    switch(requestServiceEnum) {
      case RequestServiceEnum.DELETE: return this.anyDeleteRequest(text, payload);
      case RequestServiceEnum.PUT: return this.anyPutRequest(text, payload);
      case RequestServiceEnum.POST: return this.anyPostRequest(text, payload);
      default: return this.anyGetRequest(text, payload);
    }
  }

  private anyDeleteRequest(text: string, payload?: any): Observable<any> {
    if(payload == undefined) {
      return this.httpClient.delete(text) as Observable<any>;
    }
    return this.httpClient.delete(text, payload) as Observable<any>;
  }

  private anyGetRequest(text: string, payload?: any): Observable<any> {
    if(payload == undefined) {
      return this.httpClient.get(text) as Observable<any>;
    }
    return this.httpClient.get(text, payload) as Observable<any>;
  }

  private anyPutRequest(text: string, payload: any): Observable<any> {
    return this.httpClient.put(text, payload) as Observable<any>;
  }

  private anyPostRequest(text: string, payload: any): Observable<any> {
    return this.httpClient.post(text, payload) as Observable<any>;
  }
}
