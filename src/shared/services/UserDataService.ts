import {Injectable} from "@angular/core";
import {UserData} from "../datamodels/User/model/UserData";
import {RequestService} from "./ServiceHandler/RequestService";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment";
import {User} from "../datamodels/User/model/User";
import {LocalStorageService} from "ngx-webstorage";

@Injectable({providedIn: 'root'})
export class UserDataService {

  constructor(private requestService: RequestService,
              private localStorageService: LocalStorageService) {

  }

  public async loadUserData(): Promise<UserData[]> {
    return this.requestService.anyGetRequest(`${environment.api}/userdata`)
      .toPromise();
  }

  public async loadUserDataIndex(): Promise<UserData> {
    //TODO NGRX
    const activeIndex = this.localStorageService.retrieve("userDataIndex");
    return this.requestService.anyGetRequest(`${environment.api}/userdata/single/${activeIndex}`)
      .toPromise();
  }

  public async loadUserDataWithToken(token: string): Promise<UserData> {
    return this.requestService.anyGetRequest(`${environment.api}/userdata/${token}`)
      .toPromise();
  }

  public async sendQRGenerateRequest(userDataId: number): Promise<UserData> {
    return this.requestService.anyGetRequest(`${environment.api}/userdata/qr/generate/${userDataId}`).toPromise();
  }
}
