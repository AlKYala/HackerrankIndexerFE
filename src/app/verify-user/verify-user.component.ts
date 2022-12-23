import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {readMetadata} from "@angular/compiler-cli/src/transformers/metadata_reader";
import {ResponseString} from "../../shared/datamodels/User/model/ResponseString";
import {Observable, Subscription} from "rxjs";
import {timeout} from "rxjs/operators";

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent implements OnInit, OnDestroy {

  public message: string = "amogus";

  private subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private httpClient: HttpClient) {
    this.subscription = new Subscription();
  }

  async ngOnInit() {
    await this.fireVerificationProcess();
    setTimeout(() => {this.router.navigate(['/'])}, 10000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private async fireVerificationProcess() {
    const routeUserToken = this.readUserToken();
    this.sendVerificationRequest(routeUserToken).then();
  }

  private readUserToken(): string {
    const userToken = this.route.snapshot.paramMap.get('token');
    return userToken!;
  }

  //TODO just promise.....
  private async sendVerificationRequest(token: string) {
    const request = this.httpClient.post(`${environment.api}/user/verify`, token) as Observable <ResponseString>;

    const subscription = request.subscribe((message: ResponseString) => {
        this.message = message.body;
      },
      error => {
        this.message = "Verification failed. Please ask support."
      });

    this.subscription.add(subscription);
  }
}
