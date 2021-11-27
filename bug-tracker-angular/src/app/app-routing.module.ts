import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//components
import { LoginComponent } from './components/login/login.component';
import { DeveloperHomeComponent } from './components/developer-home/developer-home.component';
import { SignupComponent } from './components/signup/signup.component';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { TicketHomeComponent } from './components/ticket-home/ticket-home.component';
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: DeveloperHomeComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'createTicket', component: CreateTicketComponent},
  {path: 'ticket', component: TicketHomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
