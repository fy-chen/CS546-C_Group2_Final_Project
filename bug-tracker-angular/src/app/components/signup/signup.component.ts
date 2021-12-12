import { Component, EventEmitter, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  role : undefined | undefined;
  
  adminPassShow = false;
  signupForm = this.formBuilder.group({
    username: '',
    password:'',
    confirmPassword:'',
    adminAccess: null,
    
  });
  

  constructor(
    private formBuilder : FormBuilder,
    private AuthService : AuthService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
  }

  radioChange(value:any){
    if (value == "2"){
      this.adminPassShow = true;
    }
    else{
      this.adminPassShow = false;
      this.signupForm.controls['adminAccess'].reset();
    }
  }

  signup(): void{
    if (this.signupForm.value.confirmPassword !== this.signupForm.value.password){
      this.openSnackBar("Passwords dont match");
    }
    else{
      this.AuthService.signup(this.signupForm).then(
        (data:any)=>{
          // this.openSnackBar(data['message']);
          this.router.navigate(['/login/']);
        },
        err=>{
          this.openSnackBar(err.error.msg);
        }
        
      )
    }
    
 }
}
