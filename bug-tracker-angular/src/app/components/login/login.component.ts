import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.checkLogin();
  }
  async checkLogin(){
    const loggedIn: any = await this.AuthService.isLoggedIn();
    // console.log(loggedIn);

    //if loggedIn already, got to role home
      if (loggedIn.loggedIn === true){
        if (loggedIn.role  == 1){
          this.router.navigate(['/admin-home']) // CHANGE TO ADMIN HOME
        }
        else{
          this.router.navigate(['/home'])
        }
      }
    //else nothing
  }
  login(): void{
    console.log("pressed")
    this.AuthService.login(this.loginForm).then(
      (data:any)=>{
        if (data['login'] === true ){
          this.router.navigate(['/home'])
        }
      },
      err=>{
        console.log(err)
      }
      
      
    )
 }

}
