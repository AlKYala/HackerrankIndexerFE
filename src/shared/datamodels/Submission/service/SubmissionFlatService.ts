import {Injectable} from "@angular/core";
import {BaseService} from "../../Base/BaseService";
import {Submission} from "../model/Submission";
import {SubmissionFlat} from "../model/SubmissionFlat";
import {ServiceHandler} from "../../../services/ServiceHandler/ServiceHandler";
import {RequestService} from "../../../services/ServiceHandler/RequestService";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubmissionFlatService implements BaseService<SubmissionFlat> {

  private serviceHandler: ServiceHandler<SubmissionFlat>;

  constructor(private requestService: RequestService) {
    this.serviceHandler = new ServiceHandler<SubmissionFlat>(requestService, "submissionFlat");
  }

  delete(id: number): Observable<number> {
    return this.serviceHandler.delete(id);
  }

  findAll(): Observable<SubmissionFlat[]> {
    return this.serviceHandler.findAll();
  }

  findById(id: number): Observable<SubmissionFlat> {
    return this.serviceHandler.findById(id);
  }

  save(instance: SubmissionFlat): Observable<SubmissionFlat> {
    return this.serviceHandler.save(instance);
  }

  update(id: number, instance: SubmissionFlat): Observable<SubmissionFlat> {
    return this.serviceHandler.update(id, instance);
  }
}
