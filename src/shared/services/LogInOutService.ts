import {Injectable} from "@angular/core";
import {AuthenticationService} from "./AuthenticationService";
import {UserLogin} from "../datamodels/User/model/UserLogin";
import {Observable} from "rxjs";
import {LocalStorageService} from "ngx-webstorage";
import {RequestService} from "./ServiceHandler/RequestService";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class LogInOutService {

  constructor(private authenticationService: AuthenticationService,
              private localStorageService: LocalStorageService,
              private requestService: RequestService,
              private router: Router) {
  }

  /**
   * redundancy - AuthenticationService already does this
   * but this service bundles login/out features so it stays
   */
  public login(userLogin: UserLogin): Observable<any> {
    return this.authenticationService.fireLogin(userLogin);
  }

  public async checkLoggedIn(): Promise<boolean> {
    let result = false;
    await this.checkIfLoginExpiredAndLogoutIfTrue().then(() => {
      if(this.localStorageService.retrieve("isLoggedIn") == 1) {
        result = true;
      }
    });
    return result;
  }

  /**
   * Just put this in your ngOnInit
   */
  public async checkIfLoginExpiredAndLogoutIfTrue() {
    const jwtToken: string = this.localStorageService.retrieve("jwt");
    if(jwtToken == undefined) {
      this.fireLogOut();
    }
    await this.requestService.anyGetRequest(`${environment.api}/isLoginValid`)
      .subscribe(
        data => {
          this.localStorageService.store("isLoggedIn", 1);
        },
        error => {
          if(error.status == 500) {
            this.localStorageService.store("isLoggedIn", 0);
          }
        }
      );
  }

  public fireLogOut() {
    this.localStorageService.clear("isLoggedIn");
    this.localStorageService.store("isLoggedIn", 0);
    this.removeJwtHeader();
    this.redirectToStartPage();
  }

  private removeJwtHeader() {
    this.localStorageService.clear("jwt");
  }

  private redirectToStartPage() {
    this.router.navigate(['/landing']);
  }
}
