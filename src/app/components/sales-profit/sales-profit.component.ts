import { Component, ViewChild, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexFill,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';

// **IMPORTANT**: we must import FormsModule to use (ngModel)
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface DepartmentCount {
  departmentName: string;
  count: number;
}

export interface SalesProfitChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
}

@Component({
  selector: 'app-sales-profit',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    NgApexchartsModule,
    MatButtonModule,
    CommonModule,
    FormsModule  // <--- This is required for [(ngModel)]
  ],
  templateUrl: './sales-profit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSalesProfitComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent;

  // The user’s chosen date for month+year; default to current date
  selectedDate: Date = new Date();

  public salesprofitChart!: Partial<SalesProfitChart> | any;
  public apiCall: Subscription;

  constructor(
    private http: HttpClient,
    private readonly cdr: ChangeDetectorRef
  ) {
    
  }

  ngOnInit(): void {
    this.salesprofitChart = {
      series: [
        { type: 'bar', name: 'This Year', data: [] },
        // { type: 'bar', name: 'Last Year', data: [] },
      ],
      chart: {
        height: 320,
        type: 'bar',
        foreColor: '#adb0bb',
        offsetX: -15,
        offsetY: 0,
        animations: { speed: 500 },
        toolbar: { show: false },
      },
      colors: ['#00A1FF', '#8965E5'],
      dataLabels: { enabled: false },
      fill: { opacity: 0.5, type: 'solid' },
      grid: {
        show: true,
        strokeDashArray: 3,
        borderColor: '#90A4AE50',
      },
      stroke: { curve: 'smooth', width: 1 },
      xaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        tickAmount: 3,
        max: 100,
      },
      legend: { show: false },
      tooltip: { theme: 'dark' },
    };
    
    this.fetchDepartmentTotals(this.selectedDate);
  }

  onMonthYearChange(date: Date | null): void {
    if (date) {
      this.selectedDate = new Date(date);
      this.selectedDate.setDate(1);
      this.fetchDepartmentTotals(this.selectedDate);
    }
  }

  chosenMonthHandler(event: any, datepicker: MatDatepicker<Date>): void {
    const normalizedMonth = event instanceof Date ? event : new Date(event);
  
    this.selectedDate = new Date(this.selectedDate);
    this.selectedDate.setMonth(normalizedMonth.getMonth());
    this.selectedDate.setFullYear(normalizedMonth.getFullYear());
    this.selectedDate.setDate(1); // Set the first day of the selected month
  
    datepicker.close();
    this.fetchDepartmentTotals(this.selectedDate);
    this.cdr.detectChanges();
  }

  fetchDepartmentTotals(dateObj: Date): void {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;

    if(this.apiCall) {
      this.apiCall.unsubscribe();
    }

    this.apiCall = this.http
      .get<DepartmentCount[]>(`http://localhost:4000/api/appointments/departmentTotals?year=${year}&month=${month}`)
      .subscribe({
        next: (response) => {
          console.log('Received department totals for', year, month, ':', response);
          if (this.salesprofitChart.series[0].data) {
            this.salesprofitChart.series[0].data = [];
          }

          this.salesprofitChart.series[0].data = response.map((item) => ({
            x: item.departmentName,
            y: item.count,
          }));

          this.chart.updateSeries(this.salesprofitChart.series);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching department totals:', err);
        },
      });
  }

  public ngOnDestroy(): void {
    if (this.apiCall) {
      this.apiCall.unsubscribe;
      this.apiCall.closed;
    }
    this.salesprofitChart = null;
  }
}
