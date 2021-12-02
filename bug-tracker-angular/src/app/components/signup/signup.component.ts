import { Component, EventEmitter, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

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
    adminAccess: null,
  });
  

  constructor(
    private formBuilder : FormBuilder,
    private AuthService : AuthService,
  ) { }

  ngOnInit(): void {
  }

  radioChange(value:any){
    if (value == "2"){
      this.adminPassShow = true;
    }
    else{
      this.adminPassShow = false;
      this.signupForm.controls['adminAccess'].reset();
    }
    console.log(this.signupForm.value)
  }

  signup(): void{
    console.log(this.signupForm.value)
    this.AuthService.signup(this.signupForm).then(
      data=>{
        
      }
      
    )
 }
}
