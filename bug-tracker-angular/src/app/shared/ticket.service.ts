import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Ticket } from '../components/tickets';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TicketService{

    apiUrl = environment.apiUrl;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) { }

    
    getTicket(id: string): Observable<Ticket>{
        
        return this.http.get<Ticket>(`${this.apiUrl}/ticket` + '/' + id);
    }

}