import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators }  from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  admin:any;
  


  constructor(
    private formbuilder: FormBuilder, 
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private AuthService :AuthService
    ) { }

  changePasswordForm = this.formbuilder.group({
    // username: new FormControl('',Validators.compose([
    //   Validators.required,
    //   Validators.minLength(6)
    // ])),
    oldPassword: new FormControl('',Validators.compose([
      Validators.required,
      Validators.minLength(6)
    ])),
    newPassword: new FormControl('',Validators.compose([
      Validators.required,
      Validators.minLength(6)
    ])),
  });
  

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
  }

  async checkRole(){

    const loggedIn: any = await this.AuthService.isLoggedIn();
    if (loggedIn.loggedIn === true){
      if (loggedIn.role  == 1){
         this.admin = true;
      }
      else{
        this.admin = false;
      }
      console.log(this.admin)
    }
  }
  changePassword():void{

    //this.changePasswordFrom.value.username = this.changePasswordFrom.value.username.trim();

    this.changePasswordForm.value.oldPassword = this.changePasswordForm.value.oldPassword.trim();

    this.changePasswordForm.value.newPassword = this.changePasswordForm.value.newPassword.trim();
    this.userService.updatePassword(this.changePasswordForm)
    .subscribe(
      (data:any)=>{
        console.log(data);
        this.AuthService.logout()

        this.router.navigate(['/login']);

      },
      (error) => {
        console.log(error)
        this.openSnackBar(error.error.error);

      }
      
    );
  }
  ngOnInit(): void {
    this.checkRole(); 
   }

}
