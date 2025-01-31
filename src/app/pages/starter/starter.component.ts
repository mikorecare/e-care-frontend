import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppBlogCardsComponent } from 'src/app/components/blog-card/blog-card.component';
import { AppSalesProfitComponent } from 'src/app/components/sales-profit/sales-profit.component';
import { AppTotalFollowersComponent } from 'src/app/components/total-followers/total-followers.component';
import { AppTotalBookingsComponent } from 'src/app/components/total-bookings/total-bookings.component';
import { AppTotalIncomeComponent } from 'src/app/components/total-income/total-income.component';
import { AppPopularProductsComponent } from 'src/app/components/popular-products/popular-products.component';
import { AppRecentBookingsComponent } from 'src/app/components/recent-bookings/recent-bookings.component';
import { AppEarningReportsComponent } from 'src/app/components/earning-reports/earning-reports.component';
import { AppointmentsService } from 'src/app/services/components/appointments/appointments.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    AppBlogCardsComponent,
    AppSalesProfitComponent,
    AppTotalFollowersComponent,
    AppTotalBookingsComponent,
    AppTotalIncomeComponent,
    AppPopularProductsComponent,
    AppRecentBookingsComponent,
    AppEarningReportsComponent,
    CommonModule
  ],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent implements OnInit{
  total: any
  complete: any
  upcoming: any
  cancelled: any
  constructor(private appointment: AppointmentsService) {
    
  }

  ngOnInit(): void {
    this.getAllTotalBooking();
    this.getAllTotalComplete();
    this.getAllTotalUpcoming();
    this.getAllCancelled();
  }

  getBackgroundColor(count: number, type: string): string {
    if (type === 'completed') {
      return count > 0 ? 'green' : 'gray';
    } else if (type === 'cancelled') {
      return count > 0 ? 'red' : 'gray';
    }
    return 'gray'; // default color
  }
  

  getAllTotalBooking() {
    this.appointment.getTotalBooking().subscribe((response) => {
      this.total = response;
    })
  }

  getAllTotalComplete() {
    this.appointment.getTotalCompleted().subscribe((response) => {
      this.complete = response;
    })
  }

  getAllTotalUpcoming() {
    this.appointment.getTotalUpcoming().subscribe((response) => {
      this.upcoming = response;
    })
  }

  getAllCancelled() {
    this.appointment.getTotalCancelled().subscribe((response) => {
      this.cancelled = response;
    })
  }
}
