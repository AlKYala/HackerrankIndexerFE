import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FormcontrolsSettings} from "../../shared/other/formcontrols.settings";
import {UserSignUp} from "../../shared/datamodels/User/model/UserSignUp";
import {AuthenticationService} from "../../shared/services/AuthenticationService";
import {UserLogin} from "../../shared/datamodels/User/model/UserLogin";
import {Router} from "@angular/router";
import {LocalStorageService} from "ngx-webstorage";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public registerForm!: FormGroup;

  public signupEmailForm!: FormControl;
  public signupPasswordForm!: FormControl;
  public signupPasswordFormRepeat!: FormControl;

  constructor(private authenticationService: AuthenticationService,
              private localStorageService: LocalStorageService,
              private router: Router) { }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  //TODO link form to view
  public initRegisterForm(): void {
    this.registerForm = new FormGroup({});

    this.signupEmailForm = FormcontrolsSettings.emailFormControl();
    this.signupPasswordForm = FormcontrolsSettings.passwordFormControl();
    this.signupPasswordFormRepeat = FormcontrolsSettings.passwordVerificationFormControl();

    this.registerForm.addControl("signUpEmail", this.signupEmailForm);
    this.registerForm.addControl("signUpPassword", this.signupPasswordForm);
    this.registerForm.addControl("signUpPasswordRepeat", this.signupPasswordFormRepeat);
  }

  public signUp() {
    this.registerForm = new FormGroup({});

    const signUpEmail           = this.signupEmailForm.value;
    const signUpPassword        = this.signupPasswordForm.value;
    const signUpPasswordRepeat  = this.signupPasswordFormRepeat.value;

    const userSignup: UserSignUp = {id: 0, email: signUpEmail, passwordHashed: signUpPassword};

    const userLogin: UserLogin = {email: signUpEmail, password: signUpPassword};

    ////console.log(userSignup);

    this.authenticationService.signUp(userSignup).subscribe(

      data => {
        this.authenticationService.fireLogin(userLogin)
          .subscribe(
            data => {
              this.localStorageService.store("isLoggedIn", 1);
              this.router.navigate(['/landing'])
            },
            error => {
              this.localStorageService.store("isLoggedIn", 0);
            }
          );
      },
    )
  }

}
