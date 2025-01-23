import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { AppEditPatientComponent } from './edit_patient.component';
import { AppAddPatientComponent } from './add_patient.component';
import { UsersService } from 'src/app/services/components/users/users.service';

export interface patientsData {
  id: number;
  patientName: string;
  profileImage: string;
  contact: string;
  address: string;
}

const ELEMENT_DATA: patientsData[] = [
  {
    id: 1,
    patientName: 'Devon Lane',
    profileImage: '../../../assets/images/profile/user-2.jpg',
    contact: '+63123456789',
    address: 'Barangay Poblacion, Davao City, Davao del Sur',
  },
  {
    id: 2,
    patientName: 'Kathryn Murphy',
    profileImage: '../../../assets/images/profile/user-3.jpg',
    contact: '+63123456790',
    address: 'Barangay Poblacion, Davao City, Davao del Sur',
  },
  {
    id: 3,
    patientName: 'Vilmalyn Cruz',
    profileImage: '../../../assets/images/profile/user-1.jpg',
    contact: '+63123456791',
    address: 'Barangay Poblacion, Davao City, Davao del Sur',
  },
  {
    id: 4,
    patientName: 'Anita Johnson',
    profileImage: '../../../assets/images/profile/user-4.jpg',
    contact: '+63123456792',
    address: 'Barangay Poblacion, Davao City, Davao del Sur',
  },
  {
    id: 5,
    patientName: 'Guy Hawkins',
    profileImage: '../../../assets/images/profile/user-5.jpg',
    contact: '+63123456793',
    address: 'Barangay Poblacion, Davao City, Davao del Sur',
  },
  {
    id: 6,
    patientName: 'Floyd Miles',
    profileImage: '../../../assets/images/profile/user-7.jpg',
    contact: '+63123456794',
    address: 'Barangay Poblacion, Davao City, Davao del Sur',
  },
];

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    TablerIconsModule,
    MatProgressBarModule,
    NgScrollbarModule,
  ],
  templateUrl: './patients.component.html',
})
export class AppPatientsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'patientName',
    'contact',
    'address',
    'actions',
  ];
  dataSource = ELEMENT_DATA;
  data: any;
  constructor(private dialog: MatDialog, private http: UsersService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.http.getAllUsers().subscribe((response) => {
      this.data = response;
      console.log(this.data);
    })
  }

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  addPatient() {
    this.dialog.open(AppAddPatientComponent, {
      height: '100vh',
    });
  }

  editPatient(element: any) {
    this.dialog.open(AppEditPatientComponent, {
      height: '100vh',
    });
  }

  deletePatient(element: any): void {
    console.log('Deleting doctor:', element);
  }
}
