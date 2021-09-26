import {HttpClient} from "@angular/common/http";
import {BaseEntity} from "../../datamodels/Base/model/BaseEntity";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ServiceHandlerEnum} from "./ServiceHandlerEnum";

//TODO: HTTPSESSIONS

export class ServiceHandler<T extends BaseEntity> {

  private subPath: string = "";
  private completePath: string = "";
  private httpClient: HttpClient;

  public constructor(httpClient: HttpClient, subPath: string) {
    this.subPath = subPath;
    this.completePath = `${environment.api}/${subPath}`;
    this.httpClient = httpClient;
  }

  public findById(id: number): Observable<T> {
    return this.httpClient.get(`${this.completePath}/${id}`) as Observable<T>;
  }

  public findAll(): Observable<T[]> {
    return this.httpClient.get(this.completePath) as Observable<T[]>
  }

  public save(instance: T): Observable<T> {
    return this.httpClient.post(this.completePath, instance) as Observable<T>;
  }

  public update(id: number, instance: T): Observable<T> {
    return this.httpClient.put(`${this.completePath}/${id}`, instance) as Observable<T>;
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete(`${this.completePath}/${id}`) as Observable<number>;
  }

  public anyRequest(serviceHandlerEnum: ServiceHandlerEnum, text: string, payload?: any): Observable<any> {
    switch(serviceHandlerEnum) {
      case ServiceHandlerEnum.DELETE: return this.anyDeleteRequest(text, payload);
      case ServiceHandlerEnum.PUT: return this.anyPutRequest(text, payload);
      case ServiceHandlerEnum.POST: return this.anyPostRequest(text, payload);
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
