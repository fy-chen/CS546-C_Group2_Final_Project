import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TicketService } from 'src/app/shared/ticket.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private ticketService: TicketService) { }

  createTicketForm = this.formbuilder.group({
    title: '',
    description: '',
    priority: '',
    errorType: '',
    project: ''
  });

  ngOnInit(): void {
  }

  createTicket(): void{
    console.log("pressed")
    this.ticketService.createTicket(this.createTicketForm).subscribe(
      (data) =>{
        console.log(data);
      }
      
    )
 }

}
