import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
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

  public resetForm!: UntypedFormGroup;

  public emailForm!: UntypedFormControl;

  private baseSubscription = new Subscription();

  constructor(private route: ActivatedRoute,
              private httpClient: HttpClient,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initTriggerPasswordResetForm();
  }

  //TODO link to view
  public initTriggerPasswordResetForm(): void {

    //this.grabQueryParam();

    this.resetForm = new UntypedFormGroup({});

    this.emailForm = FormcontrolsSettings.emailFormControl();

    this.resetForm.addControl("loginEmail", this.emailForm);
  }

  public triggerPasswordReset() {
    ////console.log(this.emailForm.value);
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
    ////console.log("firing");
  }
}
