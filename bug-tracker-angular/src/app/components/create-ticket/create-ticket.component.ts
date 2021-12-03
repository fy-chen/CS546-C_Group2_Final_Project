import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from 'src/app/shared/ticket.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {

  id: any;
  ticket: any;

  createTicketForm = this.formbuilder.group({
    title: '',
    description: '',
    priority: '',
    errorType: '',
    project: '',
    creator: ''
  });

  constructor(private formbuilder: FormBuilder, private ticketService: TicketService, private router: Router) { }

  ngOnInit(): void {
  }

  createTicket(): void{
    let creator = {
      creator: "static user 1"
    }
    this.createTicketForm.patchValue(creator);
    console.log("pressed")
    console.log(this.createTicketForm.value);
    this.ticketService.createTicket(this.createTicketForm).subscribe(
      (data) =>{
        console.log(data);
        this.ticket = data;
        this.id = this.ticket._id;
        this.router.navigate([`/ticket/${this.id}`]);
      }
      
    )
 }

}
