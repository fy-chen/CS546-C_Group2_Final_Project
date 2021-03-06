import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DeveloperHomeComponent, ConfirmDeleteDialogDev } from './components/developer-home/developer-home.component';
import { AdminHomeComponent, ConfirmDeleteDialog } from './components/admin-home/admin-home.component';
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
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import {MatRadioModule} from '@angular/material/radio';
import { EditTicketComponent } from './components/edit-ticket/edit-ticket.component';
import { ChartsModule } from 'ng2-charts';
import { AccessGuard } from './shared/access.guard';
import { ProjectsDetailsComponent } from './components/projects-details/projects-details.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import {MatTabsModule} from '@angular/material/tabs';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
// import {MatRadioDefaultOptions} from '@angular/material/radio';


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
    TicketComponent,
    CreateProjectComponent,
    DashboardHomeComponent,
    EditTicketComponent,
    ConfirmDeleteDialog,
    ProjectsDetailsComponent,
    EditProjectComponent,
    ChangePasswordComponent,
    ConfirmDeleteDialogDev,
    LandingPageComponent,
    NotFoundPageComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    MatRadioModule,
    ChartsModule,
    MatTabsModule,
  ],
  providers: [
    TicketService,
    DatePipe,
    AccessGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
