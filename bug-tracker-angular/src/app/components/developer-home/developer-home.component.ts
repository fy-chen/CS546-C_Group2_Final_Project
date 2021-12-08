import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/shared/project.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { TicketTable, searchResult } from '../tickets';
import { TicketService } from 'src/app/shared/ticket.service';
import { MatTableDataSource } from "@angular/material/table";
import { UserService } from 'src/app/shared/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-developer-home',
  templateUrl: './developer-home.component.html',
  styleUrls: ['./developer-home.component.css'],
})
export class DeveloperHomeComponent implements OnInit {

  public displayedColumns = ['No', 'Title', 'Description', 'Creator', 'Status', 'Project', 'errorType', 'createdTime', 'editButton'];

  public ticketsCreatedDataSource = new MatTableDataSource<TicketTable>();
  public ticketsAssignedDataSource = new MatTableDataSource<TicketTable>();

  tickets: any;

  ticketstable: TicketTable[] = [] as TicketTable[];

  constructor(
    private projectService : ProjectService,
    private router : Router,
    private AuthService :AuthService,
    private userService: UserService,
    private datepipe: DatePipe
  ) {}

  createproject = '';
  searchTerm = '';
  searchRes: Array<any> =[];
  ngOnInit(): void {
    // this.AuthService.isLoggedIn().then(
    //   (data:any)=>{
    //     if (data===true){
    //       //do nothing
    //     }
    //     else{
    //       this.router.navigate(['/login']);
    //     }
    //   }
    // );
    this.userService.getTicketsFromUser().subscribe((data) => {
      this.tickets = data;

      this.ticketstable = [] as TicketTable[];

      for(let i = 0; i < this.tickets.createdTicket.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = this.tickets.createdTicket[i]._id;
        ticketobj.title = this.tickets.createdTicket[i].title;
        ticketobj.description = this.tickets.createdTicket[i].description;
        ticketobj.creator = this.tickets.createdTicket[i].creator;
        ticketobj.status = this.tickets.createdTicket[i].status;
        ticketobj.project = this.tickets.createdTicket[i].project;
        ticketobj.errorType = this.tickets.createdTicket[i].errorType;
        ticketobj.createdTime = this.datepipe.transform(this.tickets.createdTicket[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
        this.ticketstable.push(ticketobj);
        this.ticketsCreatedDataSource.data = this.ticketstable;
      }

      this.ticketstable = [] as TicketTable[];
      
      for(let i = 0; i < this.tickets.assignedTicket.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = this.tickets.assignedTicket[i]._id;
        ticketobj.title = this.tickets.assignedTicket[i].title;
        ticketobj.description = this.tickets.assignedTicket[i].description;
        ticketobj.creator = this.tickets.assignedTicket[i].creator;
        ticketobj.status = this.tickets.assignedTicket[i].status;
        ticketobj.project = this.tickets.assignedTicket[i].project;
        ticketobj.errorType = this.tickets.assignedTicket[i].errorType;
        ticketobj.createdTime = this.datepipe.transform(this.tickets.assignedTicket[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
        this.ticketstable.push(ticketobj);
        this.ticketsAssignedDataSource.data = this.ticketstable;
      }

    });
  }

  
  create() {
    this.createproject = 'cs546';
  }

  search(){
    this.searchRes=[]
    this.projectService.search(this.searchTerm).then(
      (data:any)=>{
        
        for(let i = 0; i <= data.length-1; i++){
          this.searchRes.push(JSON.stringify(data[i]));
          console.log(this.searchRes[i])
          if(i == data.length){
            this.searchRes = data;
          }
        }
        
      }
    )

  }

  logout(){
    this.AuthService.logout().then(
      (data:any)=>{
        if (data['loggedOut']=true){
          this.router.navigate(['/login']);
        }
      },
      error=>{
        console.log(error);
      }
    )
  }
  // ngmodal, ngif, ngfor
}
