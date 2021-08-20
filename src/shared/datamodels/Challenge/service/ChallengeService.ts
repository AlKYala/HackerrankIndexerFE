import {Injectable} from "@angular/core";
import {ServiceHandler} from "../../../services/ServiceHandler";
import {Challenge} from "../model/Challenge";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../Base/BaseService";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChallengeService implements BaseService<Challenge>{
  private serviceHandler: ServiceHandler<Challenge>;

  constructor(private httpClient: HttpClient) {
    this.serviceHandler = new ServiceHandler(this.httpClient, "challenge");
  }

  delete(id: number): Observable<number> {
    return this.serviceHandler.delete(id);
  }

  findAll(): Observable<Challenge[]> {
    return this.serviceHandler.findAll();
  }

  findById(id: number): Observable<Challenge> {
    return this.serviceHandler.findById(id);
  }

  save(instance: Challenge): Observable<Challenge> {
    return this.serviceHandler.save(instance);
  }

  update(id: number, instance: Challenge): Observable<Challenge> {
    return this.serviceHandler.update(id, instance);
  }
}
