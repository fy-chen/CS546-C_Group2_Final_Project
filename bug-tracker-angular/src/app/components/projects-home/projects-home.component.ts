import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/shared/project.service';

@Component({
  selector: 'app-projects-home',
  templateUrl: './projects-home.component.html',
  styleUrls: ['./projects-home.component.css'],
})
export class ProjectsHomeComponent implements OnInit {
  projects: any;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe((data) => {
      this.projects = data;
      console.log(this.projects);

      for (let i = 0; i < this.projects.length; i++) {
        this.projects.No = i + 1;
        this.projects._id = this.projects[i]._id;
        this.projects.projectName = this.projects[i].projectName;
        this.projects.description = this.projects[i].description;
      }
    });
  }

  createProject() {}
}
