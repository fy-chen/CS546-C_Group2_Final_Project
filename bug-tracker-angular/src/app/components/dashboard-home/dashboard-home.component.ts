import { Component, OnInit } from '@angular/core';
// import { Chart } from 'node_modules/chart.js'
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { TicketService } from 'src/app/shared/ticket.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  ticket:any
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
};
  public barChartLabels: Label[] = ["1(less important)","2(medium important)","3(most important)"]
  public barChartData: SingleDataSet = [150,200,300];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  
  constructor(private _ticketService: TicketService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
   }

  ngOnInit(): void {
    this._ticketService
  }


}
