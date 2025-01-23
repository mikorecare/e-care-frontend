import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AppEditDoctorComponent } from './edit_doctor.component';
import { AppAddDoctorComponent } from './add_doctor.component';
import { DoctorsService } from 'src/app/services/components/doctors/doctors.service';
import Swal from 'sweetalert2';
import { Department } from '../departments/model/department';
import { DepartmentsService } from 'src/app/services/components/departments/departments.service';

export interface doctorData {
  id: number;
  doctorName: string;
  profileImage: string;
  specialty: string;
  department: string;
  contact: string;
  status: string;
  statusClass: string;
}

const ELEMENT_DATA: doctorData[] = [
  {
    id: 1,
    doctorName: 'Devon Lane',
    profileImage: '../../../assets/images/profile/user-2.jpg',
    specialty: 'Ophthalmologist',
    department: 'Ophthalmology',
    contact: '+63123456789',
    status: 'Rescheduled',
    statusClass: 'bg-light-warning text-warning',
  },
  {
    id: 2,
    doctorName: 'Kathryn Murphy',
    profileImage: '../../../assets/images/profile/user-3.jpg',
    specialty: 'Dentist',
    department: 'Dental Clinic',
    contact: '+63123456790',
    status: 'Cancelled',
    statusClass: 'bg-light-error text-error',
  },
  {
    id: 3,
    doctorName: 'Vilmalyn Cruz',
    profileImage: '../../../assets/images/profile/user-1.jpg',
    specialty: 'Obstetrician',
    department: 'OB-GYNE',
    contact: '+63123456791',
    status: 'Pending',
    statusClass: 'bg-light-primary text-info',
  },
  {
    id: 4,
    doctorName: 'Anita Johnson',
    profileImage: '../../../assets/images/profile/user-4.jpg',
    specialty: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    contact: '+63123456792',
    status: 'Completed',
    statusClass: 'bg-light-success text-success',
  },
  {
    id: 5,
    doctorName: 'Guy Hawkins',
    profileImage: '../../../assets/images/profile/user-5.jpg',
    specialty: 'Pediatrician',
    department: 'Pediatrics',
    contact: '+63123456793',
    status: 'Completed',
    statusClass: 'bg-light-success text-success',
  },
  {
    id: 6,
    doctorName: 'Floyd Miles',
    profileImage: '../../../assets/images/profile/user-7.jpg',
    specialty: 'Hepatologist',
    department: 'Hepatology',
    contact: '+63123456794',
    status: 'Cancelled',
    statusClass: 'bg-light-error text-error',
  },
];

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    TablerIconsModule,
    MatProgressBarModule,
    NgScrollbarModule,
    MatDialogModule,
  ],
  templateUrl: './doctors.component.html',
})
export class AppDoctorsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'doctorName',
    'specialty',
    'department',
    'contact',
    'status',
    'actions',
  ];
  dataSource = ELEMENT_DATA;
  selectedDoctor: any = null;
  departmentId: any
  departmentData: any
  data: any;

  constructor(
    private dialog: MatDialog,
    private http: DoctorsService,
    private cbr: ChangeDetectorRef,
    private department: DepartmentsService
  ) {}

  editDoctor(element: any) {
    this.dialog.open(AppEditDoctorComponent, {
      height: '100vh',
    });
  }

  createDoctor() {
    this.dialog.open(AppAddDoctorComponent, {
      //  height: '95vh',
      width: '80vw',
    });
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.http.getAll().subscribe((response) => {
      this.data = response;
      console.log(this.data);
    });
  }

  getDepartmentById() {
    this.department.getDepartmenById(this.departmentId).subscribe((response) => {
      this.departmentData = response;
      console.log(this.departmentData)
    })
  }

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  deleteDoctor(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.deleteDoctor(id).subscribe(
          (response) => {
            this.getAll();
            Swal.fire('Deleted!', 'Your doctor has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting doctor', error);
            Swal.fire('Error!', 'Failed to delete doctor', 'error');
          }
        );
      }
    });
  }
}
