import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/project.service';
import { AuthService } from 'src/app/shared/auth.service';
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
  admin:any;

  id: any;
  projectName: any;
  description: any;
  arrOfSearch: any;
  objOfSearch: any;
  apiUrl = environment.apiUrl;

  constructor(
    private AuthService :AuthService,
    private projectService: ProjectService,
    private router: Router,
    private http: HttpClient) {}
    async checkRole(){


      const loggedIn: any = await this.AuthService.isLoggedIn();
      if (loggedIn.loggedIn === true){
        if (loggedIn.role  == 1){
           this.admin = true;
        }
        else{
          this.admin = false;
        }
      }
    }
  ngOnInit(): void {
    this.checkRole(); 
    this.arrOfSearch = [];
    this.objOfSearch = {};
    this.projectService.getAllProjects().subscribe((data) => {
      this.projects = data;
      console.log(this.projects);
      this.id = this.projects._id;
      console.log(this.id);

      for (let i = 0; i < this.projects.length; i++) {}
    });
  }

  isShown: boolean = false;

  search() {
    this.searchRes = [];
    this.isShown = !this.isShown;
    this.projectService.search(this.searchTerm).then((data: any) => {
      this.projects = data;
      // console.log(data.length);
      for (let i = 0; i < data.length; i++) {
        this.projects.No = i + 1;
        this.projects._id = this.projects[i]._id;
        this.projects.projectName = this.projects[i].projectName;
        this.projects.description = this.projects[i].description;
        this.objOfSearch = {
          projectname: this.projects.projectName,
          description: this.projects.description,
        };
        this.arrOfSearch.push(this.objOfSearch);
        console.log(this.arrOfSearch);
      }
    });
    this.arrOfSearch = [];
  }

  detailsClick(id: String) {
    this.router.navigate(['/projects/details'], { state: { id: id } });
  }

  removeProject(id: string) {
    console.log(id);
    return this.http.delete(`${this.apiUrl}/projects/` + id);
  }
}
