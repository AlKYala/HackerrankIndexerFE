import {Injectable} from "@angular/core";
import {BaseService} from "../../Base/BaseService";
import {Submission} from "../model/Submission";
import {ServiceHandler} from "../../../services/ServiceHandler/ServiceHandler";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BaseEntity} from "../../Base/model/BaseEntity";

@Injectable({
  providedIn: 'root'
})
export class SubmissionService implements BaseService<Submission> {

  private serviceHandler: ServiceHandler<Submission>;

  constructor(private httpClient: HttpClient) {
    this.serviceHandler = new ServiceHandler<Submission>(this.httpClient, "submission");
  }

  delete(id: number): Observable<number> {
    return this.serviceHandler.delete(id);
  }

  findAll(): Observable<Submission[]> {
    return this.serviceHandler.findAll();
  }

  findById(id: number): Observable<Submission> {
    return this.serviceHandler.findById(id);
  }

  save(instance: Submission): Observable<Submission> {
    return this.serviceHandler.save(instance);
  }

  update(id: number, instance: Submission): Observable<Submission> {
    return this.serviceHandler.update(id, instance);
  }
}
