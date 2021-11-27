import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ticketService } from '../service/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  id: any;
  ticket: any = {};
  constructor(private ticketService: ticketService, private route: ActivatedRoute) { }

  ngOnInit() {
    
  
  this.route.params.subscribe(params => {
    this.ticketService.getTicket(params['id'])
      .subscribe(
        res => {
          console.log(res)
          this.ticket = res;
        },
        err => {
          console.log("Error occured");
        }
      );
    });
  }

}
