import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserSignUp} from "../../shared/datamodels/User/model/UserSignUp";
import {AuthenticationService} from "../../shared/services/AuthenticationService";
import {UserLogin} from "../../shared/datamodels/User/model/UserLogin";
import {Form, UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {FormcontrolsSettings} from "../../shared/other/formcontrols.settings";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: UntypedFormGroup;

  public loginEmailForm!: UntypedFormControl;
  public loginPasswordForm!: UntypedFormControl;

  public incorrectPassword = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private localStorageService: LocalStorageService) {

  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  //TODO link view to form
  public initLoginForm(): void {
    this.loginForm = new UntypedFormGroup({});

    this.loginEmailForm = FormcontrolsSettings.emailFormControl();
    this.loginPasswordForm = FormcontrolsSettings.passwordFormControl();

    this.loginForm.addControl("loginEmail", this.loginEmailForm);
    this.loginForm.addControl("loginPasswordForm", this.loginPasswordForm);
  }

  public logIn() {
    const loginEmail = this.loginEmailForm.value;
    const loginPassword = this.loginPasswordForm.value;

    const userLogin: UserLogin = {email: loginEmail, password: loginPassword};

    this.authenticationService.fireLogin(userLogin)
      .subscribe(
        data => {
          ////console.log(data);
          this.localStorageService.store('jwt', data);
          this.localStorageService.store('email', userLogin.email);
          this.localStorageService.store("isLoggedIn", 1);
          this.router.navigate(['/landing']);
        },
        error => {
          this.incorrectPassword = true;
          this.localStorageService.store("isLoggedIn", 0);
        }
      );
    }
}
