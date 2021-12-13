import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from 'src/app/shared/ticket.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import {
  TicketTable,
  searchResult,
  deletResult,
  user,
  Project,
  Ticket,
} from '../tickets';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/user.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProjectService } from 'src/app/shared/project.service';

export interface DialogData {
  _id: string;
  type: string;
}

export interface admin {
  _id: string;
  username: string;
}

import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  currentUser: any;

  projects: any;

  showTicketsbyPriority: any;

  showTicketsbyProject: any;

  showTicketsbyErrorType: any;

  showAssignedUsers: any;

  showSearchresult: any;

  showNoInput: any;

  showEmptySpace: any;

  showNotFound: any;

  showAssignedProjects = false;

  showAssignDevs = true;

  showAssignDevstoProject = true;

  assignedProjects: any;

  haveBeenAssigned: any;

  noAssignedProjects: any;

  noAssignedUsers: any;

  tickets: any;

  ticketsByPriority: any;

  userSearch: any;

  users: any;

  assignedusers: any;

  closeResult: any;

  admin: admin = {} as admin;

  isShown: boolean = false;

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
    phrase: '',
  });

  assignProjectForm = this.formbuilder.group({
    projectId: new FormControl('', Validators.required),
    userId: new FormControl('', Validators.required),
  });

  removeProjectForm = this.formbuilder.group({
    projectId: new FormControl('', Validators.required),
    userId: new FormControl('', Validators.required),
  });

  selectSortTypeForm = this.formbuilder.group({
    type: new FormControl('', Validators.required),
  });

  public displayedColumns = [
    'No',
    'Title',
    'Description',
    'Creator',
    'Status',
    'Project',
    'errorType',
    'createdTime',
    'deleteButton',
  ];

  public userColumns = [
    'No',
    'Username',
    'Projects',
    'Tickets',
    'Created Tickets',
    'deleteButton',
  ];

  public adminUsers = new MatTableDataSource<user>();

  public developerUsers = new MatTableDataSource<user>();

  public ticketsOpeningDataSource = new MatTableDataSource<Ticket>();

  public ticketsClosedDataSource = new MatTableDataSource<Ticket>();

  public ticketsReadytoCloseDataSource = new MatTableDataSource<Ticket>();

  public Priority1DataSource = new MatTableDataSource<TicketTable>();

  public Priority2DataSource = new MatTableDataSource<TicketTable>();

  public Priority3DataSource = new MatTableDataSource<TicketTable>();

  public ticketsbyProjectDataSource = new MatTableDataSource<TicketTable>();

  public ticketsbyErrorTypeDataSource = new MatTableDataSource<TicketTable>();

  public ticketsSearchResultDataSource = new MatTableDataSource<TicketTable>();
  arrOfSearch: any;
  objOfSearch: any;
  id: any;
  apiUrl = environment.apiUrl;
  searchRes: any;
  searchTerm: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private ticketService: TicketService,
    private datepipe: DatePipe,
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();

    this.getAllTickets();

    this.getAllUsers();

    this.getAdmin();

    this.arrOfSearch = [];
    this.objOfSearch = {};
    this.projectService.getAllProjects().subscribe((data) => {
      this.projects = data;
      console.log(this.projects);
      this.id = this.projects._id;
      console.log(data);

      for (let i = 0; i < this.projects.length; i++) {}
    });

    // this.getCurrentUser();
  }

  getAdmin() {
    this.userService.getAdmin().subscribe((data: any) => {
      this.admin.username = data.username;
      this.admin._id = data._id;
    });
  }

  assignAdmin(checked: boolean, type: string) {
    if (checked && type === 'ticket') {
      this.assignTicketForm.patchValue({ userId: this.admin._id });
      this.showAssignDevs = false;
    }
    if (!checked && type === 'ticket') {
      this.assignTicketForm.patchValue({ userId: '' });
      this.showAssignDevs = true;
    }

    if (checked && type === 'project') {
      this.assignProjectForm.patchValue({ userId: this.admin._id });
      this.showAssignDevstoProject = false;
    }
    if (!checked && type === 'project') {
      this.assignProjectForm.patchValue({ userId: '' });
      this.showAssignDevstoProject = true;
    }
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((data: any) => {
      this.developerUsers = new MatTableDataSource(
        data.filter((element: any) => {
          if (element['role'] == 2) {
            return true;
          }
          return false;
        })
      );
      console.log(this.developerUsers);
      this.developerUsers.filterPredicate = (
        data: any,
        filterValue: string
      ): boolean => {
        if (
          data.username.trim().toLowerCase().indexOf(filterValue) !== -1 ||
          this.arrayTurnerProj(data.assignedProjects, filterValue) ||
          this.arrayTurnerTick(data.assignedTickets, filterValue) ||
          this.arrayTurnerTick(data.createdTickets, filterValue)
        ) {
          return true;
        }
        return false;
      };
      this.adminUsers = new MatTableDataSource(
        data.filter((element: any) => {
          if (element['role'] == 1) {
            return true;
          }
          return false;
        })
      );
      this.adminUsers.filterPredicate = (
        data: any,
        filterValue: string
      ): boolean => {
        if (
          data.username.trim().toLowerCase().indexOf(filterValue) !== -1 ||
          this.arrayTurnerProj(data.assignedProjects, filterValue) ||
          this.arrayTurnerTick(data.assignedTickets, filterValue) ||
          this.arrayTurnerTick(data.createdTickets, filterValue)
        ) {
          return true;
        }
        return false;
      };
      this.users = data.filter((element: any) => {
        if (element['role'] == 2) {
          return true;
        }
        return false;
      });
    });
  }

  arrayTurnerProj(array: Array<Project>, filterValue: string): boolean {
    for (let i = 0; i <= array.length - 1; i++) {
      if (array[i]) {
        if (
          array[i].projectName.trim().toLowerCase().indexOf(filterValue) !== -1
        ) {
          // console.log("true")
          return true;
        }
      }
    }
    return false;
  }

  arrayTurnerTick(array: Array<Ticket>, filterValue: string): boolean {
    for (let i = 0; i <= array.length - 1; i++) {
      if (array[i]) {
        if (array[i].title.trim().toLowerCase().indexOf(filterValue) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  applyFilter(target: any) {
    let value = target.value;
    value = value.trim();
    value = value.toLowerCase();
    this.adminUsers.filter = value;
    this.developerUsers.filter = value;
  }

  applyTicketFilter(target: any) {
    let value = target.value;
    value = value.trim();
    value = value.toLowerCase();
    this.ticketsOpeningDataSource.filter = value;
    this.ticketsReadytoCloseDataSource.filter = value;
    this.ticketsClosedDataSource.filter = value;
  }

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
  }

  openDialog(id: string, type: string) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      data: { _id: id, type: type },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result.type === 'ticket') {
        this.deleteTicket(result._id);
      } else if (result.type === 'user') {
        this.deleteUser(result._id);
      } else if (result.type === 'Project') {
        console.log('got into project again');
        this.deleteProject(result._id);
      }
    });
  }

  deleteTicket(id: string) {
    console.log(id);
    this.ticketService.removeTicket(id).subscribe((data) => {
      let result: deletResult = data;
      console.log(result);
      if (result.deleted === true) {
        this.openSnackBar('Ticket has been succesfully deleted');
        this.ngOnInit();
      }
    });
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe((data: any) => {
      console.log(data);
      if (data.deleted === true) {
        this.openSnackBar('User has been succesfully deleted');
        this.ngOnInit();
      } else {
        this.openSnackBar('Something went wrong');
      }
    });
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe((data) => {
      this.projects = data;
      console.log(this.projects);
      for (let i = 0; i < this.projects.length; i++) {
        this.projects.No = i + 1;
        this.projects._id = this.projects[i]._id;
        this.projects.projectName = this.projects[i].projectName;
        this.projects.description = this.projects[i].description;
      }
    });
  }

  search() {
    this.searchRes = [];
    this.isShown = !this.isShown;
    this.projectService.search(this.searchTerm).then((data: any) => {
      // console.log(data.length);
      for (let i = 0; i < data.length; i++) {
        this.projects.No = i + 1;
        this.projects._id = this.projects[i]._id;
        this.projects.projectName = this.projects[i].projectName;
        this.projects.description = this.projects[i].description;
        this.objOfSearch = {
          projectname: this.projects.projectName,
          description: this.projects.description,
        };
        this.arrOfSearch.push(this.objOfSearch);
        console.log(this.arrOfSearch);
      }
    });
    this.arrOfSearch = [];
  }

  detailsClick(id: String) {
    this.router.navigate(['/projects/details'], { state: { id: id } });
  }

  assignProject() {
    // let projectId = this.assignProjectForm.value.projectId;
    this.userService
      .assignProjecttoUser(this.assignProjectForm)
      .subscribe((data) => {
        this.openSnackBar('User successfully assgined');
        this.ngOnInit();
      });
  }

  getAssignedProjects() {
    // this.removeTicketForm.patchValue({userId: null});
    console.log(this.removeProjectForm.value);
    if (this.removeProjectForm.value.userId) {
      this.userService
        .getUser(this.removeProjectForm.value.userId)
        .subscribe((data: any) => {
          this.assignedProjects = data.assignedProjects;

          if (this.assignedProjects.length === 0) {
            this.noAssignedProjects = true;
            this.showAssignedProjects = false;
          } else {
            this.showAssignedProjects = true;
            this.noAssignedProjects = false;
          }
        });
    }
  }

  removeProject() {
    this.userService
      .removeProjectFromUser(this.removeProjectForm)
      .subscribe((data: any) => {
        let result = data;
        console.log(result);
        // if(result.deleted === true){
        //
        this.openSnackBar('Project has been succesfully deleted');
        this.getAssignedProjects();
        this.ngOnInit();
        // }
      });
  }

  // deleteProject(id: string) {
  //   console.log(id);
  //   return this.http.delete(`${this.apiUrl}/projects/` + id);
  // }
  deleteProject(id: string) {
    this.projectService.deleteProject(id).subscribe(
      (data: any) => {
        console.log(data);
        if (data.success === true) {
          this.openSnackBar('Project has been succesfully deleted');
          this.ngOnInit();
        } else {
          this.openSnackBar('Something went wrong');
        }
      },
      (err) => {
        this.openSnackBar(err.error.message);
      }
    );
  }
  getAllTickets() {
    this.ticketService.getAllTickets().subscribe((data) => {
      this.tickets = data;

      // this.ticketstable = [] as TicketTable[];

      // let closedtickets = [] as TicketTable[];

      // let ticketsReadytoClose = [] as TicketTable[];

      // for(let i = 0; i < this.tickets.length; i++) {
      //   let ticketobj: TicketTable = {} as TicketTable;
      //   ticketobj.No = i + 1;
      //   ticketobj._id = this.tickets[i]._id;
      //   ticketobj.title = this.tickets[i].title;
      //   ticketobj.description = this.tickets[i].description;
      //   ticketobj.creator = this.tickets[i].creator;
      //   ticketobj.status = this.tickets[i].status;
      //   ticketobj.project = this.tickets[i].project;
      //   ticketobj.errorType = this.tickets[i].errorType;
      //   ticketobj.createdTime = this.datepipe.transform(this.tickets[i].createdTime, 'yyyy-MM-dd hh:mm:ss');

      //   if(ticketobj.status === 'open'){
      //     this.ticketstable.push(ticketobj);
      //   }else if(ticketobj.status === 'ready_to_close') {
      //     ticketsReadytoClose.push(ticketobj);
      //   }else if(ticketobj.status === 'closed') {
      //     closedtickets.push(ticketobj);
      //   }

      // }

      this.ticketsOpeningDataSource = new MatTableDataSource(
        data.filter((element: any) => {
          if (element['status'] == 'open') {
            element.createdTime = this.datepipe.transform(
              element.createdTime,
              'yyyy-MM-dd hh:mm:ss'
            );
            return true;
          }
          return false;
        })
      );
      this.ticketsOpeningDataSource.filterPredicate = (
        data: any,
        filterValue: string
      ): boolean => {
        if (
          data.title.trim().toLowerCase().indexOf(filterValue) !== -1 ||
          data.description.trim().toLowerCase().indexOf(filterValue) !== -1 ||
          data.errorType.trim().toLowerCase().indexOf(filterValue) !== -1
        ) {
          return true;
        }
        return false;
      };
      this.ticketsReadytoCloseDataSource = new MatTableDataSource(
        data.filter((element: any) => {
          if (element['status'] == 'ready_to_close') {
            element.createdTime = this.datepipe.transform(
              element.createdTime,
              'yyyy-MM-dd hh:mm:ss'
            );
            return true;
          }
          return false;
        })
      );
      this.ticketsReadytoCloseDataSource.filterPredicate = (
        data: any,
        filterValue: string
      ): boolean => {
        if (
          data.title.trim().toLowerCase().indexOf(filterValue) !== -1 ||
          data.description.trim().toLowerCase().indexOf(filterValue) !== -1 ||
          data.errorType.trim().toLowerCase().indexOf(filterValue) !== -1
        ) {
          return true;
        }
        return false;
      };
      this.ticketsClosedDataSource = new MatTableDataSource(
        data.filter((element: any) => {
          if (element['status'] == 'closed') {
            element.createdTime = this.datepipe.transform(
              element.createdTime,
              'yyyy-MM-dd hh:mm:ss'
            );
            return true;
          }
          return false;
        })
      );
      this.ticketsClosedDataSource.filterPredicate = (
        data: any,
        filterValue: string
      ): boolean => {
        if (
          data.title.trim().toLowerCase().indexOf(filterValue) !== -1 ||
          data.description.trim().toLowerCase().indexOf(filterValue) !== -1 ||
          data.errorType.trim().toLowerCase().indexOf(filterValue) !== -1
        ) {
          return true;
        }
        return false;
      };
      // this.ticketsOpeningDataSource.data = this.ticketstable;
      // this.ticketsReadytoCloseDataSource.data = ticketsReadytoClose;
      // this.ticketsClosedDataSource.data = closedtickets
    });
  }

  assignTicket() {
    let ticketId = this.assignTicketForm.value.ticketId;
    this.ticketService.getTicket(ticketId).subscribe((data) => {
      let ticket = data;
      for (let user of ticket.assignedUsers) {
        if (user._id === this.assignTicketForm.value.userId) {
          this.haveBeenAssigned = true;
          return;
        }
      }
      this.userService
        .assignTickettoUser(this.assignTicketForm)
        .subscribe((data) => {
          let result = data;
          console.log(result);
          this.haveBeenAssigned = false;
          this.openSnackBar('User Assigned Succeed');
          this.ngOnInit();
        });
    });
  }

  removeTicket() {
    this.userService
      .removeTicketfromUser(this.removeTicketForm)
      .subscribe((data) => {
        let result = data;
        console.log(result);
        this.noAssignedUsers = false;
        this.openSnackBar('Remove Succeed');
        this.getAssignedUsers();
        this.ngOnInit();
      });
  }

  getAssignedUsers() {
    this.removeTicketForm.patchValue({ userId: null });
    if (this.removeTicketForm.value.ticketId) {
      this.ticketService
        .getTicket(this.removeTicketForm.value.ticketId)
        .subscribe((data) => {
          this.assignedusers = data.assignedUsers;

          if (this.assignedusers.length === 0) {
            this.noAssignedUsers = true;
            this.showAssignedUsers = false;
          } else {
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
      for (let i = 0; i < ticketsPriority1.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = ticketsPriority1[i]._id;
        ticketobj.title = ticketsPriority1[i].title;
        ticketobj.description = ticketsPriority1[i].description;
        ticketobj.creator = ticketsPriority1[i].creator;
        ticketobj.status = ticketsPriority1[i].status;
        ticketobj.project = ticketsPriority1[i].project;
        ticketobj.errorType = ticketsPriority1[i].errorType;
        ticketobj.createdTime = this.datepipe.transform(
          ticketsPriority1[i].createdTime,
          'yyyy-MM-dd hh:mm:ss'
        );
        this.ticketstable.push(ticketobj);
        this.Priority1DataSource.data = this.ticketstable;
      }

      this.ticketstable = [] as TicketTable[];
      for (let i = 0; i < ticketsPriority2.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = ticketsPriority2[i]._id;
        ticketobj.title = ticketsPriority2[i].title;
        ticketobj.description = ticketsPriority2[i].description;
        ticketobj.creator = ticketsPriority2[i].creator;
        ticketobj.status = ticketsPriority2[i].status;
        ticketobj.project = ticketsPriority2[i].project;
        ticketobj.errorType = ticketsPriority2[i].errorType;
        ticketobj.createdTime = this.datepipe.transform(
          ticketsPriority2[i].createdTime,
          'yyyy-MM-dd hh:mm:ss'
        );
        this.ticketstable.push(ticketobj);
        this.Priority2DataSource.data = this.ticketstable;
      }

      this.ticketstable = [] as TicketTable[];
      for (let i = 0; i < ticketsPriority3.length; i++) {
        let ticketobj: TicketTable = {} as TicketTable;
        ticketobj.No = i + 1;
        ticketobj._id = ticketsPriority3[i]._id;
        ticketobj.title = ticketsPriority3[i].title;
        ticketobj.description = ticketsPriority3[i].description;
        ticketobj.creator = ticketsPriority3[i].creator;
        ticketobj.status = ticketsPriority3[i].status;
        ticketobj.project = ticketsPriority3[i].project;
        ticketobj.errorType = ticketsPriority3[i].errorType;
        ticketobj.createdTime = this.datepipe.transform(
          ticketsPriority3[i].createdTime,
          'yyyy-MM-dd hh:mm:ss'
        );
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

      for (let i = 0; i < ticketsbyProject.length; i++) {
        if (sortedTicket.indexOf(i) === -1) {
          let ticketobj: TicketTable = {} as TicketTable;
          ticketobj.No = no++;
          ticketobj._id = ticketsbyProject[i]._id;
          ticketobj.title = ticketsbyProject[i].title;
          ticketobj.description = ticketsbyProject[i].description;
          ticketobj.creator = ticketsbyProject[i].creator;
          ticketobj.status = ticketsbyProject[i].status;
          ticketobj.project = ticketsbyProject[i].project;
          ticketobj.errorType = ticketsbyProject[i].errorType;
          ticketobj.createdTime = this.datepipe.transform(
            ticketsbyProject[i].createdTime,
            'yyyy-MM-dd hh:mm:ss'
          );
          this.ticketstable.push(ticketobj);
          sortedTicket.push(i);
          for (let j = i + 1; j < ticketsbyProject.length; j++) {
            if (ticketsbyProject[i].project === ticketsbyProject[j].project) {
              let ticketobj: TicketTable = {} as TicketTable;
              ticketobj.No = no++;
              ticketobj._id = ticketsbyProject[j]._id;
              ticketobj.title = ticketsbyProject[j].title;
              ticketobj.description = ticketsbyProject[j].description;
              ticketobj.creator = ticketsbyProject[j].creator;
              ticketobj.status = ticketsbyProject[j].status;
              ticketobj.project = ticketsbyProject[j].project;
              ticketobj.errorType = ticketsbyProject[j].errorType;
              ticketobj.createdTime = this.datepipe.transform(
                ticketsbyProject[j].createdTime,
                'yyyy-MM-dd hh:mm:ss'
              );
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

      for (let i = 0; i < ticketsbyProject.length; i++) {
        if (sortedTicket.indexOf(i) === -1) {
          let ticketobj: TicketTable = {} as TicketTable;
          ticketobj.No = no++;
          ticketobj._id = ticketsbyProject[i]._id;
          ticketobj.title = ticketsbyProject[i].title;
          ticketobj.description = ticketsbyProject[i].description;
          ticketobj.creator = ticketsbyProject[i].creator;
          ticketobj.status = ticketsbyProject[i].status;
          ticketobj.project = ticketsbyProject[i].project;
          ticketobj.errorType = ticketsbyProject[i].errorType;
          ticketobj.createdTime = this.datepipe.transform(
            ticketsbyProject[i].createdTime,
            'yyyy-MM-dd hh:mm:ss'
          );
          this.ticketstable.push(ticketobj);
          sortedTicket.push(i);
          for (let j = i + 1; j < ticketsbyProject.length; j++) {
            if (
              ticketsbyProject[i].errorType === ticketsbyProject[j].errorType
            ) {
              let ticketobj: TicketTable = {} as TicketTable;
              ticketobj.No = no++;
              ticketobj._id = ticketsbyProject[j]._id;
              ticketobj.title = ticketsbyProject[j].title;
              ticketobj.description = ticketsbyProject[j].description;
              ticketobj.creator = ticketsbyProject[j].creator;
              ticketobj.status = ticketsbyProject[j].status;
              ticketobj.project = ticketsbyProject[j].project;
              ticketobj.errorType = ticketsbyProject[j].errorType;
              ticketobj.createdTime = this.datepipe.transform(
                ticketsbyProject[j].createdTime,
                'yyyy-MM-dd hh:mm:ss'
              );
              this.ticketstable.push(ticketobj);
              sortedTicket.push(j);
            }
          }
        }
      }

      this.ticketsbyErrorTypeDataSource.data = this.ticketstable;
    });
  }

  showSortedTickets() {
    let type = this.selectSortTypeForm.value.type;
    if (type === 'priority') {
      this.getTicketsByPriority();
      this.showTicketsbyPriority = true;
      this.showTicketsbyProject = false;
      this.showTicketsbyErrorType = false;
    } else if (type === 'errorType') {
      this.getTicketsByErrorType();
      this.showTicketsbyErrorType = true;
      this.showTicketsbyProject = false;
      this.showTicketsbyPriority = false;
    } else if (type === 'project') {
      this.getTicketsByProject();
      this.showTicketsbyPriority = false;
      this.showTicketsbyProject = true;
      this.showTicketsbyErrorType = false;
    }
  }

  // searchTicket() {

  //   this.showNoInput = false;
  //   this.showEmptySpace = false;
  //   this.showNotFound = false;

  //   if(!this.searchTicketForm.value.phrase){
  //     this.showNoInput = true;
  //     return;
  //   }else if(!this.searchTicketForm.value.phrase.trim()){
  //     this.showEmptySpace = true;
  //     return;
  //   }

  //   this.ticketService.searchTickets(this.searchTicketForm).subscribe((data) => {
  //     let searchResult: searchResult = data;

  //     this.ticketstable = [] as TicketTable[];

  //     if(searchResult.notFound === true){
  //       this.showNotFound = true;
  //       this.showSearchresult = false;
  //       return;
  //     }else if(searchResult.tickets){

  //       for(let i = 0; i < searchResult.tickets.length; i++) {
  //         let ticketobj: TicketTable = {} as TicketTable;
  //         ticketobj.No = i + 1;
  //         ticketobj._id = searchResult.tickets[i]._id;
  //         ticketobj.title = searchResult.tickets[i].title;
  //         ticketobj.description = searchResult.tickets[i].description;
  //         ticketobj.creator = searchResult.tickets[i].creator;
  //         ticketobj.status = searchResult.tickets[i].status;
  //         ticketobj.project = searchResult.tickets[i].project;
  //         ticketobj.errorType = searchResult.tickets[i].errorType;
  //         ticketobj.createdTime = this.datepipe.transform(searchResult.tickets[i].createdTime, 'yyyy-MM-dd hh:mm:ss');

  //         this.ticketstable.push(ticketobj);
  //       }
  //     }

  //     this.ticketsSearchResultDataSource.data = this.ticketstable;

  //     this.showSearchresult = true;
  //   });

  // }

  closeTicket(id: string) {
    this.ticketService.ChangeTicketStatus('close', id).subscribe(
      (data) => {
        this.closeResult = data;
        if (this.closeResult.updated === true) {
          this.openSnackBar('Close ticket succeed');
          this.getAllTickets();
          this.ngOnInit();
        }
      },
      (error) => {
        this.openSnackBar(error.error.err);
      }
    );
  }

  logout() {
    this.authService.logout().then(
      (data: any) => {
        if ((data['loggedOut'] = true)) {
          this.router.navigate(['/login']);
        }
      },
      (error) => {
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

  public id = this.data._id;
  public type = this.data.type;

  onNoClick(): void {
    this.dialogRef.close('Cancelled');
  }
}
