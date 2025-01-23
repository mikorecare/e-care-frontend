import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';


export interface bookingData {
    id: number;
    patientName: string;
    profileImage: string;
    orderDate: string;
    orderTime: string;
    department: string;
    status: string;
    statusClass: string;
}

const ELEMENT_DATA: bookingData[] = [
  {
    id: 1,
    patientName: 'Devon Lane',
    profileImage: '../../../assets/images/profile/user-2.jpg',
    orderDate: 'August 18, 2025',
    orderTime: 'Morning',
    department: 'Ophthalmology',
    status: 'Rescheduled',
    statusClass: 'bg-light-warning text-warning', 
  },
  {
    id: 2,
    patientName: 'Kathryn Murphy',
    profileImage: '../../../assets/images/profile/user-3.jpg',
    orderDate: 'August 18, 2025',
    orderTime: 'Morning',
    department: 'Dental Clinic',
    status: 'Cancelled',
    statusClass: 'bg-light-error text-error', 
  },
  {
    id: 3,
    patientName: 'Vilmalyn Cruz',
    profileImage: '../../../assets/images/profile/user-1.jpg',
    orderDate: 'August 18, 2025',
    orderTime: 'Afternoon',
    department: 'OB-GYNE',
    status: 'Pending',
    statusClass: 'bg-light-primary text-info  ', 
  },
  {
    id: 4,
    patientName: 'Vilmalyn Cruz',
    profileImage: '../../../assets/images/profile/user-4.jpg',
    orderDate: 'August 18, 2025',
    orderTime: 'Afternoon',
    department: 'Orthopedics',
    status: 'Completed',
    statusClass: 'bg-light-success text-success', 
  },
  {
    id: 5,
    patientName: 'Guy Hawkins',
    profileImage: '../../../assets/images/profile/user-5.jpg',
    orderDate: 'August 18, 2025',
    orderTime: 'Afternoon',
    department: 'Pediatric',
    status: 'Completed',
    statusClass: 'bg-light-success text-success', 
  },
  {
    id: 6,
    patientName: 'Floyd Miles',
    profileImage: '../../../assets/images/profile/user-7.jpg',
    orderDate: 'August 18, 2025',
    orderTime: 'Morning',
    department: 'Hepatology',
    status: 'Cancelled',
    statusClass: 'bg-light-error text-error', 
  },
  ];

@Component({
    selector: 'app-recent-bookings',
    standalone: true,
    imports: [
        MaterialModule,
        MatMenuModule,
        MatButtonModule,
        CommonModule,
        TablerIconsModule,
        MatProgressBarModule,
        NgScrollbarModule
    ],
    templateUrl: './recent-bookings.component.html',
})
export class AppRecentBookingsComponent {
    displayedColumns: string[] = ['id', 'patientName', 'orderDate', 'department', 'status', 'actions'];
    dataSource = ELEMENT_DATA;
  
    constructor() { }
  }