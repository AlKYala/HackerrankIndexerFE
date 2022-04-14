import {Injectable} from "@angular/core";
import {LocalStorageService} from "ngx-webstorage";
import {HttpClient} from "@angular/common/http";
import {UserLogin} from "../datamodels/User/model/UserLogin";
import {environment} from "../../environments/environment";
import {UserSignUp} from "../datamodels/User/model/UserSignUp";
import {switchMap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import {SubscriptionService} from "./SubscriptionService";
import {ActivatedRoute, Router} from "@angular/router";

//Login responsobilities inverted: here instead of component

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  constructor(private localStorageService: LocalStorageService,
              private httpClient: HttpClient,
              private subscriptionService: SubscriptionService,
              private router: Router) {
  }

  public signUp(user: UserSignUp): Observable<any> {
    const loginUser: UserLogin = {email: user.email, password: user.passwordHashed};
    return this.httpClient.post(`${environment.api}/user/register`, user);
  }

  public fireLogin(user: UserLogin) : Observable<any> {
    //console.log(user);
    return this.httpClient.post(`${environment.api}/authenticate`, user);
  }
}
