import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FormcontrolsSettings} from "../../shared/other/formcontrols.settings";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public resetForm!: FormGroup;

  public emailForm!: FormControl;

  private baseSubscription = new Subscription();

  private token!: string;

  constructor(private route: ActivatedRoute,
              private httpClient: HttpClient,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  //TODO link to view
  public initLoginForm(): void {

    //this.grabQueryParam();

    this.resetForm = new FormGroup({});

    this.emailForm = FormcontrolsSettings.emailFormControl();

    this.resetForm.addControl("loginEmail", this.emailForm);
  }

  public triggerPasswordReset() {
    console.log(this.emailForm.value);
    const subscription = this.httpClient.post(`${environment.api}/user/resetPassword`, this.emailForm.value)
      .subscribe((data) => {
        this.postFire(subscription);
      },
      error => {
        this.postFire(subscription)
      });
  }

  private postFire(subscription: Subscription) {
    this.toastrService.info("Email sent. Check your inbox.");
    this.baseSubscription.add(subscription);
    console.log("firing");
  }

  //TODO does not belong in this component
  private grabQueryParam() {
    const subscription: Subscription = this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    this.baseSubscription.add(subscription)
  }
}
