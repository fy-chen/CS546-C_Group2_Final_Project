import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    username: '',
    password:'',
  });
  

  constructor(
    private formBuilder : FormBuilder,
    private AuthService : AuthService,
  ) { }

  ngOnInit(): void {
  }

  login(): void{
    console.log("pressed")
    this.AuthService.login(this.loginForm).then(
      data=>{
        console.log(data);
      },
      err=>{
        console.log(err)
      }
      
      
    )
 }

}
