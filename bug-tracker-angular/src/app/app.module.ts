import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DeveloperHomeComponent } from './components/developer-home/developer-home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProjectsHomeComponent } from './components/projects-home/projects-home.component';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { TicketHomeComponent } from './components/ticket-home/ticket-home.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DeveloperHomeComponent,
    AdminHomeComponent,
    SignupComponent,
    ProjectsHomeComponent,
    CreateTicketComponent,
    TicketHomeComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
