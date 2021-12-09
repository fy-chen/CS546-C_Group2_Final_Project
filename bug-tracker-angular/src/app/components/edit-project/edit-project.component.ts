import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/shared/project.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent implements OnInit {
  id: any;
  project: any;

  editProjectForm = this.formbuilder.group({
    projectName: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        // this.onlySpaceValidator,
      ])
    ),
    description: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
        // this.onlySpaceValidator,
      ])
    ),
  });

  constructor(
    private formbuilder: FormBuilder,
    private Service: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.projectService.getProject(this.id).subscribe((data) => {
      this.project = data;
    });
  }

  onSubmit() {
    if (this.editProjectForm.valid) {
      console.log('Form Submitted!');
      this.editProjectForm.reset();
    }
  }

  onClick() {
    this.editProjectForm.reset();
  }

  updateProject(): void {
    this.editProjectForm.value.projectName =
      this.editProjectForm.value.projectName.trim();

    this.editProjectForm.value.description =
      this.editProjectForm.value.description.trim();

    this.projectService
      .updateProject(this.id, this.editProjectForm)
      .subscribe((data) => {
        console.log(data);
        this.project = data;
        if (this.project.nochanged === true) {
          console.log('nochanges');
        }
        this.location.back();
      });
  }

  // public onlySpaceValidator(control: FormControl) {
  //   const onlyWhitespace = control.value.trim().length === 0 && control.value;
  //   const isValid = !onlyWhitespace;
  //   return isValid ? null : { onlywhitespace: true };
  // }
}
