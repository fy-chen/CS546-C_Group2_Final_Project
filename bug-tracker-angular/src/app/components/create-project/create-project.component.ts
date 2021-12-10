import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/project.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})
export class CreateProjectComponent implements OnInit {
  id: any;
  project: any;
  projectlist: any;

  createProjectForm = this.formbuilder.group({
    projectName: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ])
    ),
    description: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ])
    ),
  });

  constructor(
    private formbuilder: FormBuilder,
    private ProjectService: ProjectService,
    private router: Router
  ) {
    console.log('click');
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.createProjectForm.valid) {
      console.log('Form Submitted!');
      this.createProjectForm.reset();
    }
  }

  onClick() {
    this.createProjectForm.reset();
  }

  createProject() {
    // this.createProjectForm.value.projectName =
    //   this.createProjectForm.value.projectName.trim();

    // this.createProjectForm.value.description =
    //   this.createProjectForm.value.description.trim();

    console.log('pressed');
    console.log(this.createProjectForm.value);
    this.ProjectService.createProject(this.createProjectForm).subscribe(
      (data) => {
        console.log(data);
        this.project = data;
        this.id = this.project._id;
        // this.router.navigate([`/projects/${this.id}`]);
      }
    );
  }
}
