import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from '../../shared/ticket.service';
import {MatTableDataSource} from "@angular/material/table";
import { History } from '../history';
import { Ticket } from '../tickets';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})

export class TicketComponent implements OnInit {

  
  id: any;
  
  ticket: any;

  public displayedColumns = ['No', 'Property', 'Value', 'modifiedTime'];

  public dataSource = new MatTableDataSource<History>();


  constructor(private _ticketService: TicketService, private route: ActivatedRoute, private datepipe: DatePipe) { }


  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')
    
    
    this._ticketService.getTicket(this.id)
        .subscribe((data: Ticket) => {

          this.ticket = data;
          
          for(let i = 0; i < this.ticket.history.length; i++){
            this.ticket.history[i].No = i + 1;
            this.ticket.history[i].modifiedTime = this.datepipe.transform(this.ticket.history[i].modifiedTime, 'yyyy-MM--dd');
          }

          this.dataSource.data = this.ticket.history;

        });

    

  }

}
