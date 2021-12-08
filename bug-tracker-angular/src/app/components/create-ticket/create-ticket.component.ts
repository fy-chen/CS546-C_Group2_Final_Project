import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators }  from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/project.service';
import { TicketService } from 'src/app/shared/ticket.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {

  id: any;
  ticket: any;
  projectlist:any;

  createTicketForm = this.formbuilder.group({
    title: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4), Validators.maxLength(20), this.onlySpaceValidator])),
    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4), Validators.maxLength(100), this.onlySpaceValidator])),
    priority: new FormControl('', Validators.required),
    errorType: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4), Validators.maxLength(20), this.onlySpaceValidator])),
    project: new FormControl('', Validators.required),
  });

  constructor(private formbuilder: FormBuilder, private ticketService: TicketService, private router: Router, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe(
      (data) => {
        this.projectlist = data;
        console.log(this.projectlist);
    });
  }

  createTicket(): void{

    this.createTicketForm.value.title = this.createTicketForm.value.title.trim();

    this.createTicketForm.value.description = this.createTicketForm.value.description.trim();

    this.createTicketForm.value.errorType = this.createTicketForm.value.errorType.trim();

    console.log("pressed")
    console.log(this.createTicketForm.value);
    this.ticketService.createTicket(this.createTicketForm).subscribe(
      (data) =>{
        console.log(data);
        this.ticket = data;
        this.id = this.ticket._id;
        this.router.navigate([`/ticket/${this.id}`]);
      });
 }

public onlySpaceValidator(control: FormControl) {
  if(control.value){
    const onlyWhitespace = control.value.trim().length === 0;
    const isValid = !onlyWhitespace;
    return isValid ? null : { 'onlywhitespace': true };
  }else{
    return { 'onlywhitespace': false };
  }
}

}
