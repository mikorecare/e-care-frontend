import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexLegend,
    ApexStroke,
    ApexTooltip,
    ApexAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive,
    ApexGrid,
    ApexXAxis,
    ApexYAxis,
    NgApexchartsModule,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { AppointmentsService } from 'src/app/services/components/appointments/appointments.service';

export interface totalbookingsChart {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    responsive: ApexResponsive;
    grid: ApexGrid;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    colors: string | any;
}

@Component({
    selector: 'app-total-bookings',
    standalone: true,
    imports: [MaterialModule, NgApexchartsModule, MatButtonModule, TablerIconsModule, CommonModule],
    templateUrl: './total-bookings.component.html',
    styleUrls: ['./total-booking.component.scss']
})
export class AppTotalBookingsComponent implements OnInit {
    @Input() title:string = 'Title Bookings';
    @Input() value:string = '50';
    @Input() icon: string = 'solar:cart-large-2-broken';
    isMobileOrTablet: boolean = false;
    total: any
    complete: any
    upcoming: any
    cancelled: any
    constructor(private appointment: AppointmentsService) {

    }

    ngOnInit(): void {
        this.checkViewport();
    }

    @HostListener('window:resize', [])
    onResize() { 
        this.checkViewport();
    }

    private checkViewport() {
        this.isMobileOrTablet = window.innerWidth <= 1422;
    }

    getAllTotalBooking() {
        this.appointment.getTotalBooking().subscribe((response) => {
          this.total = response;
          console.log(this.total)
        })
      }
    
      getAllTotalComplete() {
        this.appointment.getTotalCompleted().subscribe((response) => {
          this.complete = response;
          console.log(this.complete)
        })
      }
    
      getAllTotalUpcoming() {
        this.appointment.getTotalUpcoming().subscribe((response) => {
          this.upcoming = response;
          console.log(this.upcoming);
        })
      }
    
      getAllCancelled() {
        this.appointment.getTotalCancelled().subscribe((response) => {
          this.cancelled = response;
          console.log(this.cancelled);
        })
      }
}
