import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FormcontrolsSettings} from "../../shared/other/formcontrols.settings";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public resetForm!: FormGroup;

  public emailForm!: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  //TODO link to view
  public initLoginForm(): void {
    this.resetForm = new FormGroup({});

    this.emailForm = FormcontrolsSettings.emailFormControl();

    this.resetForm.addControl("loginEmail", this.emailForm);
  }

}
