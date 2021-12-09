import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators }  from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/shared/project.service';
import { TicketService } from 'src/app/shared/ticket.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css', '../../app.component.css']
})
export class EditTicketComponent implements OnInit {

  id: any;
  ticket: any;
  project: any;
  projectlist: any;

  editTicketForm = this.formbuilder.group({
    title: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4), Validators.maxLength(30), this.onlySpaceValidator])),
    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4), Validators.maxLength(100), this.onlySpaceValidator])),
    priority: new FormControl('', Validators.required),
    errorType: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(4), Validators.maxLength(30), this.onlySpaceValidator])),
    project: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  });

  constructor(private formbuilder: FormBuilder, private ticketService: TicketService, private router: Router, private route: ActivatedRoute, private projectService: ProjectService, private location: Location, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');

    this.ticketService.checkedit(this.id).subscribe(
      (data:any)=>{
        if (data.Authorized === true){
        }
        else if(data.NotAuthorized === true){
          this.router.navigate(['/home']);
        }
      }
    );
    
    
    this.ticketService.getTicket(this.id)
        .subscribe((data) => {

          this.ticket = data;

          this.projectService.getProject(this.ticket.project).subscribe(
            (data) => {
              this.project = data;
              this.editTicketForm.setValue({
                title: this.ticket.title,
                description: this.ticket.description,
                priority: this.ticket.priority.toString(),
                project: this.project._id,
                status: this.ticket.status,
                errorType: this.ticket.errorType
              }, { onlySelf: true });
            });
          });
          
          this.projectService.getAllProjects().subscribe(
            (data) => {
              this.projectlist = data;
              console.log(this.projectlist);
            });

  }

  openSnackBar(value: string) {
    this._snackBar.open(value, 'Done');
  }

  updateTicket(): void{

    this.editTicketForm.value.title = this.editTicketForm.value.title.trim();

    this.editTicketForm.value.description = this.editTicketForm.value.description.trim();

    this.editTicketForm.value.errorType = this.editTicketForm.value.errorType.trim();

    console.log(this.editTicketForm.value);
    
    this.ticketService.updateTicket(this.id, this.editTicketForm).subscribe(
      (data) =>{
        console.log(data);
        this.ticket = data;
        if(this.ticket.nochanged === true){
          console.log("nochanges");
        }
        //this.router.navigate([`/ticket/${this.id}`]);
        this.location.back();
      },
      (error) => {
        this.openSnackBar("Server Error");
      }
    );
 }

 public onlySpaceValidator(control: FormControl) {
  const onlyWhitespace = control.value.trim().length === 0 && control.value;
  const isValid = !onlyWhitespace;
  return isValid ? null : { 'onlywhitespace': true };
}

}
