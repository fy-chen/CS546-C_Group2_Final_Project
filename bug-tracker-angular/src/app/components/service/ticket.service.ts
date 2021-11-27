import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ticket } from '../tickets';
import { Observable } from 'rxjs';

@Injectable()

export class ticketService{

    ticket: any;

    ticketsUrl= 'http://localhost:3000/tickets';
    ticketUrl= 'http://localhost:3000/ticket';

    constructor(private http: HttpClient) { }

    getTickets(): Observable<Ticket> {
        this.ticket = this.http.get<Ticket>(`${this.ticketsUrl}`);
        return this.ticket;
    }
    
    
    getTicket(id: number) {
        return this.http.get(`${this.ticketUrl}` + id);
    }
}