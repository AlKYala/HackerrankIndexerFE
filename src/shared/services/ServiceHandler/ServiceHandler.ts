import {HttpClient} from "@angular/common/http";
import {BaseEntity} from "../../datamodels/Base/model/BaseEntity";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {RequestService} from "./RequestService";

export class ServiceHandler<T extends BaseEntity> {

  private subPath: string = "";
  private completePath: string = "";

  public constructor(private requestService: RequestService, subPath: string)  {
    this.subPath = subPath;
    this.completePath = `${environment.api}/${subPath}`;
  }

  public findById(id: number): Observable<T> {
    //return this.httpClient.get(`${this.completePath}/${id}`) as Observable<T>;
    return this.requestService.anyGetRequest(`${this.completePath}/${id}`) as Observable<T>;
  }

  public findAll(): Observable<T[]> {
    //return this.httpClient.get(this.completePath) as Observable<T[]>
    return this.requestService.anyGetRequest(this.completePath) as Observable<T[]>;
  }

  public save(instance: T): Observable<T> {
    //return this.httpClient.post(this.completePath, instance) as Observable<T>;
    return this.requestService.anyPostRequest(this.completePath, instance) as Observable<T>;
  }

  public update(id: number, instance: T): Observable<T> {
    //return this.httpClient.put(`${this.completePath}/${id}`, instance) as Observable<T>;
    return this.requestService.anyPutRequest(`${this.completePath}/${id}`, instance) as Observable<T>;
  }

  public delete(id: number): Observable<number> {
    //return this.httpClient.delete(`${this.completePath}/${id}`) as Observable<number>;
    return this.requestService.anyDeleteRequest(`${this.completePath}/${id}`) as Observable<number>;
  }
}
