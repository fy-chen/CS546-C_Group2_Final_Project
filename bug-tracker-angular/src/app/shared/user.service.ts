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

  assignTickettoUser(form: FormGroup) {
    return this.http.post(`${this.apiUrl}/user/assignTicket`, form.value);
  }

  removeTicketfromUser(form: FormGroup) {
    return this.http.post(`${this.apiUrl}/user/removeTicket`, form.value);
  }

}
