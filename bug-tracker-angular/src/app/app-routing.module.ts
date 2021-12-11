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
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { EditTicketComponent } from './components/edit-ticket/edit-ticket.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ProjectsDetailsComponent } from './components/projects-details/projects-details.component';
import { AccessGuard } from './shared/access.guard';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { ChangePasswordComponent} from './components/change-password/change-password.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: DeveloperHomeComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
  },
  { path: 'signup', component: SignupComponent },
  {
    path: 'ticket/create',
    component: CreateTicketComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
  },
  { path: 'ticket', component: TicketHomeComponent },
  {
    path: 'ticket/:id',
    component: TicketComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
  },
  { path: 'projects', component: ProjectsHomeComponent },
  {
    path: 'projects/create',
    component: CreateProjectComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
  },
  {
    path: 'projects/:id',
    component: ProjectsDetailsComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
  },
  {
    path: 'projects/update/:id',
    component: EditProjectComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
  },
  {
    path: 'dashboard',
    component: DashboardHomeComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
  },
  {
    path: 'ticket/edit/:id',
    component: EditTicketComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
  },

  {
    path: 'admin-home',
    component: AdminHomeComponent,
    data: { requiresLogin: true, requiresAdmin: true },
    canActivate: [AccessGuard],
  },

  {
    path: 'changePassword',
    component: ChangePasswordComponent,
    data: { requiresLogin: true},
    canActivate: [AccessGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
