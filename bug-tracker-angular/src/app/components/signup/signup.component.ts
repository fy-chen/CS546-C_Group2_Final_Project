import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm = this.formBuilder.group({
    username: '',
    password:'',
  });
  

  constructor(
    private formBuilder : FormBuilder,
    private AuthService : AuthService,
  ) { }

  ngOnInit(): void {
  }

  signup(): void{
    console.log("pressed")
    this.AuthService.signup(this.signupForm).then(
      data=>{
        console.log(data);
      }
      
    )
 }
}
