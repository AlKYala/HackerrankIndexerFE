import {Injectable} from "@angular/core";
import {RequestService} from "../../../services/ServiceHandler/RequestService";
import {UserDataFlat} from "../model/UserDataFlat";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserDataFlatService {

  constructor(private requestService: RequestService) {
  }

  public getUserDataFlatArr(): Promise<UserDataFlat[]> {
    return this.requestService.anyGetRequest(`${environment.api}/userdata/flat`).toPromise();
  }

  public removeEntry(index: number) {
    return this.requestService.anyDeleteRequest(`${environment.api}/userdata/flat/delete/${index}`).toPromise();
  }
}
