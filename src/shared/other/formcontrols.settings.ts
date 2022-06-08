import {Form, UntypedFormControl, Validators} from "@angular/forms";

export class FormcontrolsSettings {
  private static MIN_INPUT_LENGTH = 8;
  private static MAX_INPUT_LENGTH = 128;

  public static emailFormControl(): UntypedFormControl {
    return new UntypedFormControl('', [Validators.required, Validators.email]);
  }

  public static passwordFormControl(): UntypedFormControl {
    return new UntypedFormControl('', [Validators.required,
      Validators.minLength(FormcontrolsSettings.MIN_INPUT_LENGTH),
      Validators.maxLength(FormcontrolsSettings.MAX_INPUT_LENGTH)]);
  }

  public static passwordVerificationFormControl(): UntypedFormControl {
    return new UntypedFormControl('', [Validators.required]);
  }
}
