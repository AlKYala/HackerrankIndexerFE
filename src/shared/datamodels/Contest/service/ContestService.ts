import {Injectable} from "@angular/core";
import {BaseService} from "../../Base/BaseService";
import {Contest} from "../model/Contest";
import {HttpClient} from "@angular/common/http";
import {ServiceHandler} from "../../../services/ServiceHandler/ServiceHandler";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContestService implements BaseService<Contest> {

  private serviceHandler: ServiceHandler<Contest>;

  constructor(private httpClient: HttpClient) {
    this.serviceHandler = new ServiceHandler<Contest>(this.httpClient, "contest");
  }

  delete(id: number): Observable<number> {
    return this.serviceHandler.delete(id);
  }

  findAll(): Observable<Contest[]> {
    return this.serviceHandler.findAll();
  }

  findById(id: number): Observable<Contest> {
    return this.serviceHandler.findById(id);
  }

  save(instance: Contest): Observable<Contest> {
    return this.serviceHandler.save(instance);
  }

  update(id: number, instance: Contest): Observable<Contest> {
    return this.serviceHandler.update(id, instance);
  }

}
