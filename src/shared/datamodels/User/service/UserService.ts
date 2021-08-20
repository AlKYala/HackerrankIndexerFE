import {Injectable} from "@angular/core";
import {BaseService} from "../../Base/BaseService";
import {User} from "../model/User";
import {HttpClient} from "@angular/common/http";
import {ServiceHandler} from "../../../services/ServiceHandler";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService implements BaseService<User> {

  private serviceHandler: ServiceHandler<User>;

  constructor(private httpClient: HttpClient) {
    this.serviceHandler = new ServiceHandler<User>(this.httpClient, "user");
  }

  delete(id: number): Observable<number> {
    return this.serviceHandler.delete(id);
  }

  findAll(): Observable<User[]> {
    return this.serviceHandler.findAll();
  }

  findById(id: number): Observable<User> {
    return this.serviceHandler.findById(id);
  }

  save(instance: User): Observable<User> {
    return this.serviceHandler.save(instance);
  }

  update(id: number, instance: User): Observable<User> {
    return this.serviceHandler.update(id, instance);
  }

}
