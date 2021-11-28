import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from '../../shared/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  
  id: any;
  
  ticket: any;
  

  constructor(private _ticketService: TicketService, private route: ActivatedRoute) { }


  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')
    
    
    this._ticketService.getTicket(this.id)
        .subscribe((data:any) => {this.ticket = data;});
  
  }

}
