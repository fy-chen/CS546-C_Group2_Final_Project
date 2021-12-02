import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//components
import { LoginComponent } from './components/login/login.component';
import { DeveloperHomeComponent } from './components/developer-home/developer-home.component';
import { SignupComponent } from './components/signup/signup.component';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { TicketHomeComponent } from './components/ticket-home/ticket-home.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { ProjectsHomeComponent } from './components/projects-home/projects-home.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { DashboardHomeComponent} from './components/dashboard-home/dashboard-home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DeveloperHomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'ticket/create', component: CreateTicketComponent },
  { path: 'ticket', component: TicketHomeComponent },
  { path: 'ticket/:id', component: TicketComponent },
  { path: 'projects', component: ProjectsHomeComponent },
  { path: 'projects/create', component: CreateProjectComponent },
  { path: 'dashboard', component : DashboardHomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
