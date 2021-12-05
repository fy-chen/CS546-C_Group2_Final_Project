import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/shared/ticket.service';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css', '../../app.component.css']
})
export class EditTicketComponent implements OnInit {

  id: any;
  ticket: any;
  project: any;

  editTicketForm = this.formbuilder.group({
    title: '',
    description: '',
    priority: '',
    errorType: '',
    project: '',
    status: ''
  });

  constructor(private formbuilder: FormBuilder, private ticketService: TicketService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');
    
    
    this.ticketService.getTicket(this.id)
        .subscribe((data) => {

          this.ticket = data;

          this.editTicketForm.setValue({
            title: this.ticket.title,
            description: this.ticket.description,
            priority: this.ticket.priority.toString(),
            project: this.ticket.project,
            status: this.ticket.status,
            errorType: this.ticket.errorType
          }, { onlySelf: true });

    });

  }

  updateTicket(): void{

    console.log(this.editTicketForm.value);
    
    this.ticketService.updateTicket(this.id, this.editTicketForm).subscribe(
      (data) =>{
        console.log(data);
        this.ticket = data;
        this.router.navigate([`/ticket/${this.id}`]);
      }
      
    )
 }

}