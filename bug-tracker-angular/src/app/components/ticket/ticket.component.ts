import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from '../../shared/ticket.service';
import { MatTableDataSource } from "@angular/material/table";
import { History } from '../history';
import { Ticket } from '../tickets';
import { DatePipe } from '@angular/common';
import { ProjectService } from 'src/app/shared/project.service';

import {Comment} from '../comment';
import { CommentService } from './comment.service';

@Component({
  selector: 'app-ticket',
  providers: [CommentService],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css', '../../app.component.css']
})

export class TicketComponent implements OnInit {

  
  id: any;
  
  ticket: any;

  assignedUsers: any;

  project: any;

  comments: any;

  public displayedColumns = ['No', 'Property', 'Value', 'modifiedTime'];

  public dataSource = new MatTableDataSource<History>();


  constructor(private CommentService: CommentService,private _ticketService: TicketService, private route: ActivatedRoute, private datepipe: DatePipe, private projectService: ProjectService) { }

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
    newComment.userId = "creator";
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
    .subscribe();
  }
  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');
    
    
    this._ticketService.getTicket(this.id)
        .subscribe((data: Ticket) => {

          this.ticket = data;

          this.project = this.ticket.project;

          this.projectService.getProject(this.ticket.project).subscribe(
            (data) => {
              this.project = data;
            });
          

          this.assignedUsers = this.ticket.assignedUsers;

          this.ticket.createdTime = this.datepipe.transform(this.ticket.createdTime, 'yyyy-MM-dd hh:mm:ss');
          
          for(let i = 0; i < this.ticket.history.length; i++){
            this.ticket.history[i].No = i + 1;
            this.ticket.history[i].modifiedTime = this.datepipe.transform(this.ticket.history[i].modifiedTime, 'yyyy-MM-dd hh:mm:ss');
          }

          this.dataSource.data = this.ticket.history;

        });

        this.getAllComment();
    

  }

}
