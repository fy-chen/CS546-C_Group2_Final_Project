import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(private authService: AuthService,private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const requiresLogin = route.data['requiresLogin'] || false;
      const requiresAdmin = route.data['requiresAdmin'] || false;
      if (requiresLogin){
        this.authService.isLoggedIn().then(
          (data:any)=>{
            if (data['loggedIn']===true){

            }
            else{
              this.router.navigate(['/login']);
            }
          }
        );
      }
      if(requiresAdmin){
        this.authService.isLoggedIn().then(
          (data:any)=>{
            if (data['role']===1){
            }
            else{
              this.router.navigate(['/login']);
            }
          }
        );
      }
    return true;
  }
  
}
