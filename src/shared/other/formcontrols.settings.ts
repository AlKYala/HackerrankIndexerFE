import {Form, FormControl, Validators} from "@angular/forms";

export class FormcontrolsSettings {
  private static MIN_INPUT_LENGTH = 8;
  private static MAX_INPUT_LENGTH = 128;

  public static emailFormControl(): FormControl {
    return new FormControl('', [Validators.required, Validators.email]);
  }

  public static passwordFormControl(): FormControl {
    return new FormControl('', [Validators.required,
      Validators.minLength(FormcontrolsSettings.MIN_INPUT_LENGTH),
      Validators.maxLength(FormcontrolsSettings.MAX_INPUT_LENGTH)]);
  }

  public static passwordVerificationFormControl(): FormControl {
    return new FormControl('', [Validators.required]);
  }
}
