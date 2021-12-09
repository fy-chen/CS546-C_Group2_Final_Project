import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from '../../shared/ticket.service';
import { MatTableDataSource } from "@angular/material/table";
import { History } from '../history';
import { Ticket } from '../tickets';
import { DatePipe } from '@angular/common';
import { ProjectService } from 'src/app/shared/project.service';
import { Location } from '@angular/common';
import {Comment} from '../comment';
import { CommentService } from '../../shared/comment.service';
import { UserService } from 'src/app/shared/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ticket',
  providers: [CommentService],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css', '../../app.component.css']
})

export class TicketComponent implements OnInit {

  
  id: any;
  
  ticket: Ticket = {} as Ticket;

  assignedUsers: any;

  comments: any;

  showEditTicket: any;

  errorMessage: any;

  showTicketNotFound: any;

  showTicketInfo: any;

  public displayedColumns = ['No', 'Property', 'Value', 'modifiedTime'];

  public dataSource = new MatTableDataSource<History>();


  constructor(private CommentService: CommentService,private _ticketService: TicketService, private route: ActivatedRoute, private datepipe: DatePipe, private projectService: ProjectService, private userService: UserService, private location: Location, private _snackBar: MatSnackBar) { }

  getAllComment(): void{
    this.CommentService.getAllComment(this.id)
    .subscribe((comments) => (this.comments = comments));
  }

  createComment(text: string): void{
    text = text.trim();
    if(!text){
      return;
    }
  
    const newComment: Comment = {text} as Comment;
    newComment.ticketId = this.id;
    this.CommentService
      .createComment(newComment)
      .subscribe(comment => {
        this.comments = comment;
        console.log(this.comments);
      });
  }

  delete(comment:Comment):void{
    this.CommentService
    .deleteComment(comment._id)
    .subscribe(
      (data) => {
        console.log(data);
        this.getAllComment();
      });
    
  }

  back() {
    this.location.back();
  }

  ngOnInit(): void {

    this.showTicketInfo = true;

    this.id = this.route.snapshot.paramMap.get('id');

    this._ticketService.checkedit(this.id).subscribe(
      (data:any)=>{

        console.log(data);
        if (data.Authorized === true){
          this.showEditTicket = true;
        }
        else if(data.NotAuthorized === true){
          this.showEditTicket = false;
        }
      }
    );
    
    
    this._ticketService.getTicket(this.id)
        .subscribe((data: Ticket) => {

          this.ticket = data;

          this.projectService.getProject(this.ticket.project).subscribe(
            (data: any) => {
              this.ticket.project = data.projectName;
          });

          this.userService.getUser(this.ticket.creator).subscribe(
            (data: any) => {
              this.ticket.creator = data.username;
            }
          )
          

          this.assignedUsers = this.ticket.assignedUsers;

          this.ticket.createdTime = this.datepipe.transform(this.ticket.createdTime, 'yyyy-MM-dd hh:mm:ss');
          
          for(let i = 0; i < this.ticket.history.length; i++){
            this.ticket.history[i].No = i + 1;
            this.ticket.history[i].modifiedTime = this.datepipe.transform(this.ticket.history[i].modifiedTime, 'yyyy-MM-dd hh:mm:ss');
          }

          this.dataSource.data = this.ticket.history;
        
        },
        error => {
          this.errorMessage = error;
          console.log(this.errorMessage.error.error);
          if(this.errorMessage.error.error = "No ticket with that id"){
            this.showTicketNotFound = true;
            this.showTicketInfo = false;
          }else{
            this.openSnackBar("Server Error");
          }
        });

    this.getAllComment();
    

  }

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
  }

}
