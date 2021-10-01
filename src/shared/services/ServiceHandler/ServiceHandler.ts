import {HttpClient} from "@angular/common/http";
import {BaseEntity} from "../../datamodels/Base/model/BaseEntity";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

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
}
