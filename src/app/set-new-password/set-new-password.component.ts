import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {FormcontrolsSettings} from "../../shared/other/formcontrols.settings";
import {PasswordResetModel} from "../../shared/datamodels/security/PasswordResetModel";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {

  private baseSubscription: Subscription = new Subscription();

  private token!: string;

  public email!: string;

  public resetForm!: UntypedFormGroup;

  public passwordForm!: UntypedFormControl;

  public passwordConfirmForm!: UntypedFormControl;

  constructor(private route: ActivatedRoute,
              private httpClient: HttpClient,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initSetNewPasswordForm();
  }

  public initSetNewPasswordForm(): void {

    this.grabQueryParam();

    this.resetForm = new UntypedFormGroup({});

    this.passwordForm = FormcontrolsSettings.passwordFormControl();
    this.passwordConfirmForm = FormcontrolsSettings.passwordVerificationFormControl()

    this.resetForm.addControl("password", this.passwordForm);
    this.resetForm.addControl("passwordConfirm", this.passwordConfirmForm);
  }


  //TODO does not belong in this component
  private grabQueryParam() {
    const subscription: Subscription = this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      ////console.log(this.token);
      ////console.log(this.email);
    });
    this.baseSubscription.add(subscription)
  }

  public sendPasswordReset() {
    const password = this.passwordForm.value;
    const resetInfo: PasswordResetModel = {token: this.token, email: this.email, password: password};
    ////console.log(resetInfo);
    this.httpClient.post(`${environment.api}/user/updatePassword`, resetInfo).subscribe();
  }
}
