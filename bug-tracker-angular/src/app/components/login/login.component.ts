import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private _snackBar: MatSnackBar
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

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
  }

  login(): void{
    this.AuthService.login(this.loginForm).then(
      (data:any)=>{
        if (data['login'] === true ){
          console.log(data)
          if (data['userRole']===1){
            this.router.navigate(['/admin-home'])
          }
          else{
            this.router.navigate(['/home'])
          }
         
        }
      },
      err=>{
        console.log(err)
        this.openSnackBar(err.error.message)
      }
      
      
    )
 }

}
