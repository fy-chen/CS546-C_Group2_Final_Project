import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/project.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-projects-home',
  templateUrl: './projects-home.component.html',
  styleUrls: ['./projects-home.component.css'],
})
export class ProjectsHomeComponent implements OnInit {
  projects: any;
  searchRes: any;
  searchTerm: any;
  id: any;
  apiUrl = environment.apiUrl;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe((data) => {
      this.projects = data;
      console.log(this.projects);
      this.id = this.projects._id;
      console.log(this.id);

      for (let i = 0; i < this.projects.length; i++) {
        this.projects.No = i + 1;
        this.projects._id = this.projects[i]._id;
        this.projects.projectName = this.projects[i].projectName;
        this.projects.description = this.projects[i].description;
      }
    });
  }

  isShown: boolean = false;

  search() {
    this.searchRes = [];
    this.isShown = !this.isShown;
    this.projectService.search(this.searchTerm).then((data: any) => {
      for (let i = 0; i <= data.length - 1; i++) {
        this.searchRes.push(JSON.stringify(data[i]));
        console.log(this.searchRes[i]);
        if (i == data.length) {
          this.searchRes = data;
        }
      }
    });
  }

  detailsClick(id: String) {
    this.router.navigate(['/projects/details'], { state: { id: id } });
  }

  removeProject(id: string) {
    console.log(id);
    return this.http.delete(`${this.apiUrl}/projects/` + id);
  }
}
