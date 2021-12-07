import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
  ) {
   }

   isLoggedIn() {
     return new Promise((resolve, reject) => {
      const headers = new Headers(); 
      this.http.get(`${this.apiUrl}/login`).subscribe({
        next: (data: Object)=> { resolve(data);},
        error: (error) => {  reject(error);}
      }
       );
   });

  }

   //login
   login(form: FormGroup){
    return new Promise((resolve, reject) => {
      const headers = new Headers(); 
      this.http.post(`${this.apiUrl}/login`, form.value).subscribe({
        next: (data: object)=> { resolve(data);},
        error: (error) => {  reject(error);}
      }
       );
   });
  }

  signup(form: FormGroup){
    return new Promise((resolve, reject) => {
      const headers = new Headers(); 
      this.http.post(`${this.apiUrl}/signup`, form.value).subscribe({
        next: (data: any)=> { resolve(data);},
        error: (error) => {  reject(error);}
      }
       );
   });
  }

  //logout
  logout(){
    return new Promise((resolve, reject) => {
      const headers = new Headers(); 
      this.http.get(`${this.apiUrl}/logout`).subscribe({
        next: (data: any)=> { resolve(data);},
        error: (error) => {  reject(error);}
      }
       );
   });
  }
}
