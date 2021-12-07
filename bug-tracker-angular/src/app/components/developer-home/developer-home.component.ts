import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/shared/project.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
  selector: 'app-developer-home',
  templateUrl: './developer-home.component.html',
  styleUrls: ['./developer-home.component.css'],
})
export class DeveloperHomeComponent implements OnInit {
  constructor(
    private projectService : ProjectService,
    private router : Router,
    private AuthService :AuthService
  ) {}

  createproject = '';
  searchTerm = '';
  searchRes: Array<any> =[];
  ngOnInit(): void {
    // this.AuthService.isLoggedIn().then(
    //   (data:any)=>{
    //     if (data===true){
    //       //do nothing
    //     }
    //     else{
    //       this.router.navigate(['/login']);
    //     }
    //   }
    // );
  }

  
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

  logout(){
    this.AuthService.logout().then(
      (data:any)=>{
        if (data['loggedOut']=true){
          this.router.navigate(['/login']);
        }
      },
      error=>{
        console.log(error);
      }
    )
  }
  // ngmodal, ngif, ngfor
}
