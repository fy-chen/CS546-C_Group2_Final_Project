import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DeveloperHomeComponent } from './components/developer-home/developer-home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProjectsHomeComponent } from './components/projects-home/projects-home.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { TicketHomeComponent } from './components/ticket-home/ticket-home.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { TicketService } from './shared/ticket.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from "./app.material-module";
import { DatePipe } from '@angular/common';

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
    TicketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule
  ],
  providers: [
    TicketService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
