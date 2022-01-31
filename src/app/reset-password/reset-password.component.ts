import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FormcontrolsSettings} from "../../shared/other/formcontrols.settings";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

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

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

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
    const subscription = this.httpClient.post(`${environment.api}/resetPassword`, this.emailForm.value).subscribe();
    console.log(this.emailForm.value);
    this.baseSubscription.add(subscription);
  }

  //TODO does not belong in this component
  private grabQueryParam() {
    const subscription: Subscription = this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    this.baseSubscription.add(subscription)
  }
}
