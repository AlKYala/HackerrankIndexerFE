import {Injectable} from "@angular/core";
import {BaseService} from "../../Base/BaseService";
import {Planguage} from "../model/PLanguage";
import {ServiceHandler} from "../../../services/ServiceHandler";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PLanguageService implements BaseService<Planguage> {

  private serviceHandler: ServiceHandler<Planguage>;

  constructor(private httpClient: HttpClient) {
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
}
