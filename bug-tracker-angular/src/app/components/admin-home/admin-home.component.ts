import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from 'src/app/shared/ticket.service';
import { MatTableDataSource } from "@angular/material/table";
import { DatePipe } from '@angular/common';
import { TicketTable } from '../tickets';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})

export class AdminHomeComponent implements OnInit {

  showTickets: any;

  showAssigntoUser: any;
  
  tickets: any;

  ticketstable: TicketTable[] = [] as TicketTable[];

  public displayedColumns = ['No', 'Title', 'Description', 'Creator', 'Status', 'createdTime', 'deleteButton'];

  public ticketsDataSource = new MatTableDataSource<TicketTable>();

  constructor(private _snackBar: MatSnackBar, private ticketService: TicketService, private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.ticketService.getAllTickets().subscribe((data) => {
      this.tickets = data;

      for(let i = 0; i < this.tickets.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = this.tickets[i]._id;
        ticketobj.title = this.tickets[i].title;
        ticketobj.description = this.tickets[i].description;
        ticketobj.creator = this.tickets[i].creator;
        ticketobj.status = this.tickets[i].status;
        ticketobj.createdTime = this.datepipe.transform(this.tickets[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
        this.ticketstable.push(ticketobj);
      }

      this.ticketsDataSource.data = this.ticketstable;
    });
  }

  openDeleteTicketSuccessSnackBar() {
    this._snackBar.open('Ticket Deleted!', 'Done');
  }

  showTicketsButtonClicked() {
    this.showAssigntoUser = false;
    this.showTickets = true;
  }

  showAssigntoUserButtonClicked() {
    this.showAssigntoUser = true;
    this.showTickets = false;
  }

  deleteTicket(id: string) {
    console.log(id);
    this.ticketService.removeTicket(id);

  }

}
