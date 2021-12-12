import { Component, OnInit, Inject } from '@angular/core';
import { ProjectService } from 'src/app/shared/project.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { TicketTable, searchResult, deletResult } from '../tickets';
import { TicketService } from 'src/app/shared/ticket.service';
import { MatTableDataSource } from "@angular/material/table";
import { UserService } from 'src/app/shared/user.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

export interface DialogData {
  _id: string;
}

export interface dev {
  _id: string;
  username: string;
}


@Component({
  selector: 'app-developer-home',
  templateUrl: './developer-home.component.html',
  styleUrls: ['./developer-home.component.css'],
})
export class DeveloperHomeComponent implements OnInit {

  public displayedColumns = ['No', 'Title', 'Description', 'Creator', 'Status', 'Project', 'errorType', 'createdTime', 'editButton'];

  public ticketsCreatedDataSource = new MatTableDataSource<TicketTable>();
  public ticketsAssignedDataSource = new MatTableDataSource<TicketTable>();

  dev: dev = {} as dev;

  tickets: any;

  showNoInput: any;

  showEmptySpace: any;

  showNotFound: any;

  showSearchresult: any;

  ticketstable: TicketTable[] = [] as TicketTable[];
  applyResult: any;

  searchTicketForm = this.formbuilder.group({
    phrase: ''
  });

  public ticketsSearchResultDataSource = new MatTableDataSource<TicketTable>();


  constructor(
    private projectService : ProjectService,
    private router : Router,
    private AuthService :AuthService,
    private userService: UserService,
    private datepipe: DatePipe,
    private ticketService: TicketService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formbuilder: FormBuilder
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
    
    this.getTicketFromUser();

    this.getDev();

  }

  getDev() {
    this.userService.getDev().subscribe((data: any) => {
      this.dev.username = data.username;
      this.dev._id = data._id;
    });
  }

  openDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogDev, {data: {_id: id}});
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result && result !== "Cancelled"){
        this.deleteTicket(result._id);
      }
    });
  }

  getTicketFromUser() {
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

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
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

  ApplytoClose(id: string) {
    this.ticketService.ChangeTicketStatus("readyToClose", id).subscribe(
      (data) => {
        this.applyResult = data;
        if(this.applyResult.updated === true){
          this.openSnackBar("Apply to close ticket succeed");
          this.getTicketFromUser();
        }
      }
    );
  }

  isopen(status: string) {
    if(status === "open") {
      return true;
    }else {
      return false;
    }
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

  searchTicket() {

    this.showNoInput = false;
    this.showEmptySpace = false;
    this.showNotFound = false;

    if(!this.searchTicketForm.value.phrase){
      this.showNoInput = true;
      return;
    }else if(!this.searchTicketForm.value.phrase.trim()){
      this.showEmptySpace = true;
      return;
    }

    let ticketlist = this.tickets.assignedTicket.concat(this.tickets.createdTicket);

    console.log(ticketlist);

    this.ticketstable = [] as TicketTable[];

    let no = 1;

    let phrase = this.searchTicketForm.value.phrase.toLowerCase();

    for(let x of ticketlist){
      if(x.title.toLowerCase().indexOf(phrase) !== -1 || x.description.toLowerCase().indexOf(phrase) !== -1 || x.errorType.toLowerCase().indexOf(phrase) !== -1){
        let hasbeensearched = false;
        for(let y of this.ticketstable){
          if(x._id === y._id){
            hasbeensearched = true;
            break;
          }
        }
        if(!hasbeensearched){
          let ticketobj: TicketTable = {} as TicketTable;
          ticketobj.No = no;
          ticketobj._id = x._id;
          ticketobj.title = x.title;
          ticketobj.description = x.description;
          ticketobj.creator = x.creator;
          ticketobj.status = x.status;
          ticketobj.project = x.project;
          ticketobj.errorType = x.errorType;
          ticketobj.createdTime = this.datepipe.transform(x.createdTime, 'yyyy-MM-dd hh:mm:ss');
          this.ticketstable.push(ticketobj);
          no++;
        }
        
      }

      console.log(this.ticketstable);

      if(this.ticketstable.length === 0) {
        this.showNotFound = true;
        this.showSearchresult = false;
      }else{
        this.ticketsSearchResultDataSource.data = this.ticketstable;
        this.showSearchresult = true;
        this.showNotFound = false;
      }

    }
  

  }

}

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: 'dialog.html',
})

export class ConfirmDeleteDialogDev {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogDev>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  public id = this.data._id;

  onNoClick(): void {
    this.dialogRef.close('Cancelled');
  }
}
