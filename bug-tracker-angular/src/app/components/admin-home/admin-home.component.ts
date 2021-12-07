import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from 'src/app/shared/ticket.service';
import { MatTableDataSource } from "@angular/material/table";
import { DatePipe } from '@angular/common';
import { TicketTable } from '../tickets';
import { FormBuilder, FormControl, Validators }  from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})

export class AdminHomeComponent implements OnInit {

  showTickets: any;

  showAssigntoUser: any;

  showRemoveTicket: any;

  showAssignedUsers: any;

  showTicketsbyPriority: any;

  haveBeenAssigned: any;

  noAssignedUsers: any;
  
  tickets: any;

  ticketsByPriority: any;

  users: any;

  assignedusers: any;

  ticketstable: TicketTable[] = [] as TicketTable[];

  assignTicketForm = this.formbuilder.group({
    ticketId: new FormControl('', Validators.required),
    userId: new FormControl('', Validators.required),
  });

  removeTicketForm = this.formbuilder.group({
    ticketId: new FormControl('', Validators.required),
    userId: new FormControl('', Validators.required),
  });

  public displayedColumns = ['No', 'Title', 'Description', 'Creator', 'Status', 'createdTime', 'deleteButton'];

  public ticketsDataSource = new MatTableDataSource<TicketTable>();

  public Priority1DataSource = new MatTableDataSource<TicketTable>();

  public Priority2DataSource = new MatTableDataSource<TicketTable>();

  public Priority3DataSource = new MatTableDataSource<TicketTable>();

  constructor(private userService: UserService, private _snackBar: MatSnackBar, private ticketService: TicketService, private datepipe: DatePipe, private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.ticketService.getAllTickets().subscribe((data) => {
      this.tickets = data;

      this.ticketstable = [] as TicketTable[];

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

    this.userService.getAllUsers().subscribe((data) =>{
      this.users = data;
    });

    this.getTicketsByPriority();
    
  }

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
  }

  showTicketsButtonClicked() {
    this.showAssigntoUser = false;
    this.showTickets = true;
    this.showRemoveTicket = false;
    this.showTicketsbyPriority = false;
  }

  showAssigntoUserButtonClicked() {
    this.haveBeenAssigned = false;
    this.showAssigntoUser = true;
    this.showTickets = false;
    this.showRemoveTicket = false;
    this.showTicketsbyPriority = false;
  }

  showRemoveUserButtonClicked() {
    this.noAssignedUsers = false;
    this.showAssigntoUser = false;
    this.showTickets = false;
    this.showRemoveTicket = true;
    this.showTicketsbyPriority = false;
  }

  showTicketsSortedByPriority() {
    this.showAssigntoUser = false;
    this.showTickets = false;
    this.showRemoveTicket = false;
    this.showTicketsbyPriority = true;
  }

  deleteTicket(id: string) {
    console.log(id);
    this.ticketService.removeTicket(id);
  }

  assignTicket() {
    let ticketId = this.assignTicketForm.value.ticketId;
    this.ticketService.getTicket(ticketId).subscribe((data) =>{
      let ticket = data;
      for(let user of ticket.assignedUsers){
        if(user._id === this.assignTicketForm.value.userId){
          this.haveBeenAssigned = true;
          return;
        }
      }
      this.userService.assignTickettoUser(this.assignTicketForm).subscribe((data) => {
        let result = data;
        console.log(result);
        this.haveBeenAssigned = false;
        this.openSnackBar("User Assigned Succeed");
      });
    });
  }

  removeTicket() {
    this.userService.removeTicketfromUser(this.removeTicketForm).subscribe((data) => {
      let result = data;
      console.log(result);
      this.noAssignedUsers = false;
      this.openSnackBar("Remove Succeed");
      this.getAssignedUsers();
    });
  }

  getAssignedUsers() {
    if(this.removeTicketForm.value.ticketId){
      this.ticketService.getTicket(this.removeTicketForm.value.ticketId).subscribe((data) => {
        this.assignedusers = data.assignedUsers;

        if(this.assignedusers.length === 0){
          this.noAssignedUsers = true;
          this.showAssignedUsers = false;
        }else{
          this.showAssignedUsers = true;
          this.noAssignedUsers = false;
        }
      });
    }
  }

  getTicketsByPriority() {
    this.ticketService.getTicketsByPriority().subscribe((data) => {
      this.ticketsByPriority = data;
      let ticketsPriority1 = this.ticketsByPriority.ticketsPriority1;
      let ticketsPriority2 = this.ticketsByPriority.ticketsPriority2;
      let ticketsPriority3 = this.ticketsByPriority.ticketsPriority3;

      

      for(let i = 0; i < ticketsPriority1.length; i++) {
        this.ticketstable = [] as TicketTable[];
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = ticketsPriority1[i]._id;
        ticketobj.title = ticketsPriority1[i].title;
        ticketobj.description = ticketsPriority1[i].description;
        ticketobj.creator = ticketsPriority1[i].creator;
        ticketobj.status = ticketsPriority1[i].status;
        ticketobj.createdTime = this.datepipe.transform(ticketsPriority1[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
        this.ticketstable.push(ticketobj);
        this.Priority1DataSource.data = this.ticketstable;
      }

      for(let i = 0; i < ticketsPriority2.length; i++) {
        this.ticketstable = [] as TicketTable[];
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = ticketsPriority2[i]._id;
        ticketobj.title = ticketsPriority2[i].title;
        ticketobj.description = ticketsPriority2[i].description;
        ticketobj.creator = ticketsPriority2[i].creator;
        ticketobj.status = ticketsPriority2[i].status;
        ticketobj.createdTime = this.datepipe.transform(ticketsPriority2[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
        this.ticketstable.push(ticketobj);
        this.Priority2DataSource.data = this.ticketstable;
      }

      for(let i = 0; i < ticketsPriority3.length; i++) {
        this.ticketstable = [] as TicketTable[];
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = ticketsPriority3[i]._id;
        ticketobj.title = ticketsPriority3[i].title;
        ticketobj.description = ticketsPriority3[i].description;
        ticketobj.creator = ticketsPriority3[i].creator;
        ticketobj.status = ticketsPriority3[i].status;
        ticketobj.createdTime = this.datepipe.transform(ticketsPriority3[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
        this.ticketstable.push(ticketobj);
        this.Priority3DataSource.data = this.ticketstable;
      }

      
    });
  }

}
