import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from 'src/app/shared/ticket.service';
import { MatTableDataSource } from "@angular/material/table";
import { DatePipe } from '@angular/common';
import { TicketTable, searchResult, deletResult } from '../tickets';
import { FormBuilder, FormControl, Validators }  from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  _id: string;
}
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

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

  showTicketsbyProject: any;

  showTicketsbyErrorType: any;

  showSearchresult: any;

  showNoInput: any;

  showEmptySpace: any;

  showNotFound: any;

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

  searchTicketForm = this.formbuilder.group({
    phrase: ''
  });


  public displayedColumns = ['No', 'Title', 'Description', 'Creator', 'Status', 'Project', 'errorType', 'createdTime', 'deleteButton'];

  public ticketsOpeningDataSource = new MatTableDataSource<TicketTable>();
  

  public ticketsClosedDataSource = new MatTableDataSource<TicketTable>();

  public ticketsReadytoCloseDataSource = new MatTableDataSource<TicketTable>();

  public Priority1DataSource = new MatTableDataSource<TicketTable>();

  public Priority2DataSource = new MatTableDataSource<TicketTable>();

  public Priority3DataSource = new MatTableDataSource<TicketTable>();

  public ticketsbyProjectDataSource = new MatTableDataSource<TicketTable>();

  public ticketsbyErrorTypeDataSource = new MatTableDataSource<TicketTable>();

  public ticketsSearchResultDataSource = new MatTableDataSource<TicketTable>();

  constructor(private router: Router, public dialog: MatDialog, private userService: UserService, private _snackBar: MatSnackBar, private ticketService: TicketService, private datepipe: DatePipe, private formbuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {

    this.getAllTickets();

    this.userService.getAllUsers().subscribe((data) =>{
      this.users = data;
    });
    
  }

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
  }

  showTicketsButtonClicked() {
    this.showAssigntoUser = false;
    this.showTickets = true;
    this.showRemoveTicket = false;
    this.showTicketsbyPriority = false;
    this.showTicketsbyProject = false;
    this.showTicketsbyErrorType = false;
    this.getAllTickets();
  }

  showAssigntoUserButtonClicked() {
    this.haveBeenAssigned = false;
    this.showAssigntoUser = true;
    this.showTickets = false;
    this.showRemoveTicket = false;
    this.showTicketsbyPriority = false;
    this.showTicketsbyProject = false;
    this.showTicketsbyErrorType = false;
  }

  showRemoveUserButtonClicked() {
    this.noAssignedUsers = false;
    this.showAssigntoUser = false;
    this.showTickets = false;
    this.showRemoveTicket = true;
    this.showTicketsbyPriority = false;
    this.showTicketsbyProject = false;
    this.showTicketsbyErrorType = false;
  }

  showTicketsSortedByPriority() {
    this.showAssigntoUser = false;
    this.showTickets = false;
    this.showRemoveTicket = false;
    this.showTicketsbyPriority = true;
    this.showTicketsbyProject = false;
    this.showTicketsbyErrorType = false;
    this.getTicketsByPriority();
  }

  showTicketsSortedbyProject() {
    this.showAssigntoUser = false;
    this.showTickets = false;
    this.showRemoveTicket = false;
    this.showTicketsbyPriority = false;
    this.showTicketsbyProject = true;
    this.showTicketsbyErrorType = false;
    this.getTicketsByProject();
  }

  showTicketsSortedbyErrorType() {
    this.showAssigntoUser = false;
    this.showTickets = false;
    this.showRemoveTicket = false;
    this.showTicketsbyPriority = false;
    this.showTicketsbyProject = false;
    this.showTicketsbyErrorType = true;
    this.getTicketsByErrorType();
  }

  openDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {data: {_id: id}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.deleteTicket(id);
      }
    });
  }

  deleteTicket(id: string) {
    console.log(id);
    this.ticketService.removeTicket(id).subscribe((data) =>{
      let result: deletResult = data;
      console.log(result);
      if(result.deleted === true){
        location.reload();
        this.openSnackBar("Ticket has been succesfully deleted");
      }
    });
  }

  getAllTickets() {

    this.ticketService.getAllTickets().subscribe((data) => {
      this.tickets = data;

      this.ticketstable = [] as TicketTable[];

      let closedtickets = [] as TicketTable[];

      let ticketsReadytoClose = [] as TicketTable[];

      for(let i = 0; i < this.tickets.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = this.tickets[i]._id;
        ticketobj.title = this.tickets[i].title;
        ticketobj.description = this.tickets[i].description;
        ticketobj.creator = this.tickets[i].creator;
        ticketobj.status = this.tickets[i].status;
        ticketobj.project = this.tickets[i].project;
        ticketobj.errorType = this.tickets[i].errorType;
        ticketobj.createdTime = this.datepipe.transform(this.tickets[i].createdTime, 'yyyy-MM-dd hh:mm:ss');

        if(ticketobj.status === 'open'){
          this.ticketstable.push(ticketobj);
        }else if(ticketobj.status === 'ready_to_close') {
          ticketsReadytoClose.push(ticketobj);
        }else if(ticketobj.status === 'closed') {
          closedtickets.push(ticketobj);
        }
        
      }

      this.ticketsOpeningDataSource.data = this.ticketstable;
      this.ticketsReadytoCloseDataSource.data = ticketsReadytoClose;
      this.ticketsClosedDataSource.data = closedtickets
    });

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

      

      this.ticketstable = [] as TicketTable[];
      for(let i = 0; i < ticketsPriority1.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = ticketsPriority1[i]._id;
        ticketobj.title = ticketsPriority1[i].title;
        ticketobj.description = ticketsPriority1[i].description;
        ticketobj.creator = ticketsPriority1[i].creator;
        ticketobj.status = ticketsPriority1[i].status;
        ticketobj.project = ticketsPriority1[i].project;
        ticketobj.errorType = ticketsPriority1[i].errorType;
        ticketobj.createdTime = this.datepipe.transform(ticketsPriority1[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
        this.ticketstable.push(ticketobj);
        this.Priority1DataSource.data = this.ticketstable;
      }

      this.ticketstable = [] as TicketTable[];
      for(let i = 0; i < ticketsPriority2.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = ticketsPriority2[i]._id;
        ticketobj.title = ticketsPriority2[i].title;
        ticketobj.description = ticketsPriority2[i].description;
        ticketobj.creator = ticketsPriority2[i].creator;
        ticketobj.status = ticketsPriority2[i].status;
        ticketobj.project = ticketsPriority2[i].project;
        ticketobj.errorType = ticketsPriority2[i].errorType;
        ticketobj.createdTime = this.datepipe.transform(ticketsPriority2[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
        this.ticketstable.push(ticketobj);
        this.Priority2DataSource.data = this.ticketstable;
      }

      this.ticketstable = [] as TicketTable[];
      for(let i = 0; i < ticketsPriority3.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = ticketsPriority3[i]._id;
        ticketobj.title = ticketsPriority3[i].title;
        ticketobj.description = ticketsPriority3[i].description;
        ticketobj.creator = ticketsPriority3[i].creator;
        ticketobj.status = ticketsPriority3[i].status;
        ticketobj.project = ticketsPriority3[i].project;
        ticketobj.errorType = ticketsPriority3[i].errorType;
        ticketobj.createdTime = this.datepipe.transform(ticketsPriority3[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
        this.ticketstable.push(ticketobj);
        this.Priority3DataSource.data = this.ticketstable;
      }

      
    });
  }

  getTicketsByProject() {
    this.ticketService.getAllTickets().subscribe((data) => {
      let ticketsbyProject = data;

      let sortedTicket: any[] = [];

      let no = 0;

      this.ticketstable = [] as TicketTable[];

      for(let i = 0; i < ticketsbyProject.length; i++) {
        if(sortedTicket.indexOf(i) === -1){
          let ticketobj: TicketTable = {} as TicketTable;
          ticketobj.No = no++ ;
          ticketobj._id = ticketsbyProject[i]._id;
          ticketobj.title = ticketsbyProject[i].title;
          ticketobj.description = ticketsbyProject[i].description;
          ticketobj.creator = ticketsbyProject[i].creator;
          ticketobj.status = ticketsbyProject[i].status;
          ticketobj.project = ticketsbyProject[i].project;
          ticketobj.errorType = ticketsbyProject[i].errorType;
          ticketobj.createdTime = this.datepipe.transform(ticketsbyProject[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
          this.ticketstable.push(ticketobj);
          sortedTicket.push(i);
          for(let j = i + 1; j < ticketsbyProject.length; j++) {
            if(ticketsbyProject[i].project === ticketsbyProject[j].project){
              let ticketobj: TicketTable = {} as TicketTable;
              ticketobj.No = no++;
              ticketobj._id = ticketsbyProject[j]._id;
              ticketobj.title = ticketsbyProject[j].title;
              ticketobj.description = ticketsbyProject[j].description;
              ticketobj.creator = ticketsbyProject[j].creator;
              ticketobj.status = ticketsbyProject[j].status;
              ticketobj.project = ticketsbyProject[j].project;
              ticketobj.errorType = ticketsbyProject[j].errorType;
              ticketobj.createdTime = this.datepipe.transform(ticketsbyProject[j].createdTime, 'yyyy-MM-dd hh:mm:ss');
              this.ticketstable.push(ticketobj);
              sortedTicket.push(j);
            }
          }
        }
        
      }

      this.ticketsbyProjectDataSource.data = this.ticketstable;
    });

  }

  getTicketsByErrorType() {
    this.ticketService.getAllTickets().subscribe((data) => {
      let ticketsbyProject = data;

      let sortedTicket: any[] = [];

      let no = 0;

      this.ticketstable = [] as TicketTable[];

      for(let i = 0; i < ticketsbyProject.length; i++) {
        if(sortedTicket.indexOf(i) === -1){
          let ticketobj: TicketTable = {} as TicketTable;
          ticketobj.No = no++ ;
          ticketobj._id = ticketsbyProject[i]._id;
          ticketobj.title = ticketsbyProject[i].title;
          ticketobj.description = ticketsbyProject[i].description;
          ticketobj.creator = ticketsbyProject[i].creator;
          ticketobj.status = ticketsbyProject[i].status;
          ticketobj.project = ticketsbyProject[i].project;
          ticketobj.errorType = ticketsbyProject[i].errorType;
          ticketobj.createdTime = this.datepipe.transform(ticketsbyProject[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
          this.ticketstable.push(ticketobj);
          sortedTicket.push(i);
          for(let j = i + 1; j < ticketsbyProject.length; j++) {
            if(ticketsbyProject[i].errorType === ticketsbyProject[j].errorType){
              let ticketobj: TicketTable = {} as TicketTable;
              ticketobj.No = no++;
              ticketobj._id = ticketsbyProject[j]._id;
              ticketobj.title = ticketsbyProject[j].title;
              ticketobj.description = ticketsbyProject[j].description;
              ticketobj.creator = ticketsbyProject[j].creator;
              ticketobj.status = ticketsbyProject[j].status;
              ticketobj.project = ticketsbyProject[j].project;
              ticketobj.errorType = ticketsbyProject[j].errorType;
              ticketobj.createdTime = this.datepipe.transform(ticketsbyProject[j].createdTime, 'yyyy-MM-dd hh:mm:ss');
              this.ticketstable.push(ticketobj);
              sortedTicket.push(j);
            }
          }
        }
        
      }

      this.ticketsbyErrorTypeDataSource.data = this.ticketstable;
    });
  }

  searchTicket() {

    this.showNoInput = false;
    this.showEmptySpace = false;
    this.showNotFound = false;

    this.showAssigntoUser = false;
    this.showTickets = false;
    this.showRemoveTicket = false;
    this.showTicketsbyPriority = false;
    this.showTicketsbyProject = false;
    this.showTicketsbyErrorType = false;

    if(!this.searchTicketForm.value.phrase){
      this.showNoInput = true;
      return;
    }else if(!this.searchTicketForm.value.phrase.trim()){
      this.showEmptySpace = true;
      return;
    }

    this.ticketService.searchTickets(this.searchTicketForm).subscribe((data) => {
      let searchResult: searchResult = data;

      this.ticketstable = [] as TicketTable[];

      if(searchResult.notFound === true){
        this.showNotFound = true;
        return;
      }else if(searchResult.tickets){

        for(let i = 0; i < searchResult.tickets.length; i++) {
          let ticketobj: TicketTable = {} as TicketTable;
          ticketobj.No = i + 1;
          ticketobj._id = searchResult.tickets[i]._id;
          ticketobj.title = searchResult.tickets[i].title;
          ticketobj.description = searchResult.tickets[i].description;
          ticketobj.creator = searchResult.tickets[i].creator;
          ticketobj.status = searchResult.tickets[i].status;
          ticketobj.project = searchResult.tickets[i].project;
          ticketobj.errorType = searchResult.tickets[i].errorType;
          ticketobj.createdTime = this.datepipe.transform(searchResult.tickets[i].createdTime, 'yyyy-MM-dd hh:mm:ss');
  
          this.ticketstable.push(ticketobj);
        }
      }

      this.ticketsSearchResultDataSource.data = this.ticketstable;

      this.showSearchresult = true;
    });

  }

  logout(){
    this.authService.logout().then(
      (data:any)=>{
        if (data['loggedOut']=true){
          this.router.navigate(['/login']);
        }
      },
      error=>{
        console.log(error);
      }
    );
  }
}

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: 'dialog.html',
})

export class ConfirmDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private ticketService: TicketService
  ) {}

  public id = this.data;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
