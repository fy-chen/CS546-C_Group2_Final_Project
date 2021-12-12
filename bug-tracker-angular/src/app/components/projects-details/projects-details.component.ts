import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { ProjectService } from 'src/app/shared/project.service';
import { UserService } from 'src/app/shared/user.service';
import { TicketService } from 'src/app/shared/ticket.service';

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css'],
})
export class ProjectsDetailsComponent implements OnInit {
  projects: any;
  users: any;
  id: any;
  role: any;
  userName: any;
  projectName: any;
  description: any;
  ticket: any;
  ticketUser: any;
  ticketTitle: any;
  ticketStatus: any;
  ticketErrorType: any;
  ticketDescription: any;
  arrOfUsers: any;
  arrOfUser: any;
  // arrOfUser: any;
  objOfUser: any;
  objOfTicket: any;
  arrOfTicket: any;
  // tickets: any;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    history.state.id;
    this.projectService.getProject(history.state.id).subscribe((data) => {
      this.arrOfUser = [];
      this.objOfUser = {};
      this.arrOfTicket = [];
      this.objOfTicket = {};
      this.projects = data;
      this.projectName = this.projects.projectName;
      this.description = this.projects.description;
      console.log(this.projects.tickets);

      for (let i = 0; i < this.projects.users.length; i++) {
        this.userService
          .getUser(this.projects.users[i])
          .subscribe((data: any) => {
            this.objOfUser = {
              username: data.username,
              role: data.role,
            };
            this.arrOfUser.push(this.objOfUser);
            if (this.objOfUser.role == 1) {
              this.objOfUser.role = 'admin';
            } else {
              this.objOfUser.role = 'developer';
            }
          });
      }

      for (let i = 0; i < this.projects.tickets.length; i++) {
        this.ticketService
          .getTicket(this.projects.tickets[i])
          .subscribe((data: any) => {
            console.log(data);
            this.objOfTicket = {
              title: data.title,
              description: data.description,
              status: data.status,
              errortype: data.errorType,
            };
            this.arrOfTicket.push(this.objOfTicket);
            console.log(this.arrOfTicket);
            // this.ticketService
            //   .getTicket(this.projects.tickets[i])
            //   .subscribe((data: any) => {
            //     console.log(data);
            //     this.objOfTicket = {
            //       title: data.title,
            //       description: data.description,
            //       ticketstatus: data.status,
            //       ticketerrortype: data.errorType,
            //     };
            //
            //   });

            this.userService
              .getUser(this.ticket.creator)
              .subscribe((data: any) => {
                this.ticketUser = data.username;
              });
          });
      }
    });
  }
}
