import {Injectable} from "@angular/core";
import {BaseService} from "../../Base/BaseService";
import {Submission} from "../model/Submission";
import {ServiceHandler} from "../../../services/ServiceHandler/ServiceHandler";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {BaseEntity} from "../../Base/model/BaseEntity";
import {RequestService} from "../../../services/ServiceHandler/RequestService";
import {FilterRequest} from "../model/FilterRequest";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SubmissionService implements BaseService<Submission> {

  private serviceHandler: ServiceHandler<Submission>;

  constructor(private requestService: RequestService) {
    this.serviceHandler = new ServiceHandler<Submission>(requestService, "submission");
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

  /**
   * A method that takes a filterRequest instance and returns the found results from backend
   * @param filterRequest
   */
  findWithFilterRequest(filterRequest: FilterRequest): Observable<Submission[]> {
    return this.requestService.anyPostRequest(`${environment.api}/submission/filter`, filterRequest) as Observable<Submission[]>;
  }
}
