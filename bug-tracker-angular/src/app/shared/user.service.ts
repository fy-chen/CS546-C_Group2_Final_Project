import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})

export class UserService {

  apiUrl = environment.apiUrl;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(`${this.apiUrl}/user/`);
  }

  deleteUser(id:string) {
    return this.http.delete(`${this.apiUrl}/user/`+id);
  }

  getUser(id: string) {
    return this.http.get(`${this.apiUrl}/user/` + id);
  }

  assignTickettoUser(form: FormGroup) {
    return this.http.post(`${this.apiUrl}/user/assignTicket`, form.value);
  }

  removeTicketfromUser(form: FormGroup) {
    return this.http.post(`${this.apiUrl}/user/removeTicket`, form.value);
  }

  getTicketsFromUser() {
    return this.http.get(`${this.apiUrl}/user/tickets/get`);
  }

  updatePassword(form: FormGroup){
    return this.http.put(`${this.apiUrl}/user/changePassword`, form.value);
  }
  assignProjecttoUser(form: FormGroup) {
    return this.http.post(`${this.apiUrl}/user/assignProject`, form.value);
  }

  removeProjectFromUser(form: FormGroup){
    return this.http.post(`${this.apiUrl}/user/unassignProject`, form.value);
  }

  getAdmin(){
    return this.http.get(`${this.apiUrl}/user/admin/get`);
  }

  getDev(){
    return this.http.get(`${this.apiUrl}/user/dev/get`);
  }

}
