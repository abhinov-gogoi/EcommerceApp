import { FormControl, ValidationErrors } from "@angular/forms";

export class EcommerceValidators {
  // this class contains custom validators

  // whitespace validation
  static notOnlyWhitespace(control: FormControl): ValidationErrors {
    // check if string contains only whitespace
    if (control.value != null && control.value.trim().length ===0) {
      // invalid, return error object
      return {'notOnlyWhitespace': true}
    }
    else {
      // string is valid
      return null
    }
  }
}
