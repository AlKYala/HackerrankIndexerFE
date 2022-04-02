import {Injectable} from "@angular/core";
import {UserData} from "../datamodels/User/model/UserData";
import {RequestService} from "./ServiceHandler/RequestService";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";
import {User} from "../datamodels/User/model/User";

@Injectable({providedIn: 'root'})
export class UserDataService {

  constructor(private requestService: RequestService) {

  }

  public async loadUserData(): Promise<UserData> {
    return this.requestService.anyGetRequest(`${environment.api}/userdata`)
      .toPromise();
  }


}
