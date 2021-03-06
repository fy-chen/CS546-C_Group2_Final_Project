import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  role: undefined | undefined;

  adminPassShow = false;

  passMatch = false;

  touched = false;
  signupForm = this.formBuilder.group({
    username: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        this.anySpaceValidator,
      ])
    ),

    password: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.minLength(6)])
    ),
    confirmPassword: new FormControl(
      '',
      Validators.compose([Validators.required])
    ),
    adminAccess: null,
  });

  constructor(
    private formBuilder: FormBuilder,
    private AuthService: AuthService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
  }

  radioChange(value: any) {
    if (value == '2') {
      this.adminPassShow = true;
    } else {
      this.adminPassShow = false;
      this.signupForm.controls['adminAccess'].reset();
    }
  }

  sameAsPass(control: FormControl) {
    if (control.value) {
      const same = control.value.password !== control.value.confirmPassword;
      return same ? null : { sameAsPass: true };
    } else {
      return { sameAsPass: false };
    }
  }

  public anySpaceValidator(control: FormControl) {
    if (control.value) {
      const anyWhitespace = control.value.trim().length != control.value.length;
      const isValid = !anyWhitespace;
      return isValid ? null : { anywhitespace: true };
    } else {
      return { anywhitespace: false };
    }
  }

  signup(): void {
    if (
      this.signupForm.value.confirmPassword !== this.signupForm.value.password
    ) {
      this.openSnackBar('Passwords dont match');
    } else {
      this.AuthService.signup(this.signupForm).then(
        (data: any) => {
          // this.openSnackBar(data['message']);
          this.router.navigate(['/login/']);
        },
        (err) => {
          this.openSnackBar(err.error.msg);
        }
      );
    }
  }

  checkPass() {
    this.touched = true;
    if (
      this.signupForm.value.confirmPassword === this.signupForm.value.password
    ) {
      this.passMatch = true;
    } else {
      this.passMatch = false;
    }
    console.log('touched: ' + this.touched);
    console.log('passMatch: ' + this.passMatch);
  }

  both() {
    console.log('result: ' + !(this.touched && !this.passMatch));
    return this.touched && !this.passMatch;
  }
  // public confirmPass(control: FormControl) {
  //   if (control.value) {
  //     const notSame = control.value.password != control.value.confirmPassword;
  //     const isValid = !notSame;
  //     return isValid ? null : { notSame: false };
  //   } else {
  //     return { notSame: true };
  //   }
  // }
  // checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
  //   let pass = this.signupForm.get('password').value;
  //   let confirmPass: = group.get('confirmPassword').value
  //   return pass === confirmPass ? null : { notSame: true }
  // }
  // checkPasswords(): ValidatorFn {
  //   return (group: FormGroup): ValidationErrors | null => {
  //     let password = this.form.value['password'];
  //     let confirmPassword = this.form.value['confirmPassword']
  //     return password === confirmPassword ? null : { notSame: true };
  //   };
  // }
}
