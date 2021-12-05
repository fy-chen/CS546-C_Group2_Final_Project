import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/shared/project.service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-developer-home',
  templateUrl: './developer-home.component.html',
  styleUrls: ['./developer-home.component.css'],
})
export class DeveloperHomeComponent implements OnInit {
  constructor(
    private projectService : ProjectService,
    private router : Router,
  ) {}

  createproject = '';
  searchTerm = '';
  searchRes: Array<any> =[];
  ngOnInit(): void {}

  create() {
    this.createproject = 'cs546';
  }

  search(){
    this.searchRes=[]
    this.projectService.search(this.searchTerm).then(
      (data:any)=>{
        
        for(let i = 0; i <= data.length-1; i++){
          this.searchRes.push(JSON.stringify(data[i]));
          console.log(this.searchRes[i])
          if(i == data.length){
            this.searchRes = data;
          }
        }
        
      }
    )

  }
  // ngmodal, ngif, ngfor
}
