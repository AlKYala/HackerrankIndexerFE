import {Injectable} from "@angular/core";
import {BaseService} from "../../Base/BaseService";
import {Planguage} from "../model/PLanguage";
import {ServiceHandler} from "../../../services/ServiceHandler/ServiceHandler";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Submission} from "../../Submission/model/Submission";
import {environment} from "../../../../environments/environment";
import {RequestServiceEnum} from "../../../services/ServiceHandler/RequestServiceEnum";
import {RequestService} from "../../../services/ServiceHandler/RequestService";

@Injectable({
  providedIn: "root"
})
export class PLanguageService implements BaseService<Planguage> {

  private serviceHandler: ServiceHandler<Planguage>;

  constructor(private httpClient: HttpClient, private requestService: RequestService) {
    this.serviceHandler = new ServiceHandler<Planguage>(this.httpClient, "planguage");
  }

  delete(id: number): Observable<number> {
    return this.serviceHandler.delete(id);
  }

  findAll(): Observable<Planguage[]> {
    return this.serviceHandler.findAll();
  }

  findById(id: number): Observable<Planguage> {
    return this.serviceHandler.findById(id);
  }

  save(instance: Planguage): Observable<Planguage> {
    return this.serviceHandler.save(instance);
  }

  update(id: number, instance: Planguage): Observable<Planguage> {
    return this.serviceHandler.update(id, instance);
  }

  getSubmissionsByPLanguageId(planguageId: number): Observable<Submission[]> {
    //return this.httpClient.get(`${environment.api}/planguage/${planguageId}/submissions`) as Observable<Submission[]>;
    return this.requestService
      .anyRequest(RequestServiceEnum.GET, `${environment.api}/planguage/${planguageId}/submissions`) as Observable<Submission[]>;
  }
}
