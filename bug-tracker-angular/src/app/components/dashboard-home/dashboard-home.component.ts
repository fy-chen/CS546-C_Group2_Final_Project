import { Component, OnInit } from '@angular/core';
// import { Chart } from 'node_modules/chart.js'
import { ChartType, ChartOptions, ChartConfiguration } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { TicketService } from 'src/app/shared/ticket.service';
import { Ticket } from '../tickets';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  ticket: any

  p1: any

  p2: any

  p3: any

  admin:any;

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  //bar



  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          }
      }]
  }
  };
  public barChartLabels: Label[] = ["1(less important)", "2(medium important)", "3(most important)"]
  public barChartData: SingleDataSet = [100,200,300];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];


  constructor(private _ticketService: TicketService,private AuthService :AuthService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

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
    this._ticketService.getTicketsByPriority()
      .subscribe((data) => {
        this.ticket = data;

        this.p1 = this.ticket.ticketsPriority1.length;
        this.p2 = this.ticket.ticketsPriority2.length;
        this.p3 = this.ticket.ticketsPriority3.length;

        this.barChartData = [this.p1,this.p2,this.p3]
      });
  }






}
