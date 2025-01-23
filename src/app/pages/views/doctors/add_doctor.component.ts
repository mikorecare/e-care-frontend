import { Component, OnInit } from '@angular/core';
import {
  MatCardHeader,
  MatCard,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DoctorsService } from 'src/app/services/components/doctors/doctors.service';
import { Doctor } from './models/doctor';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepartmentsService } from 'src/app/services/components/departments/departments.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add_doctor.component.html',
  standalone: true,
  imports: [
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatCardActions,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./add_doctor.component.scss'],
})
export class AppAddDoctorComponent implements OnInit {
  doctorData: Doctor = new Doctor();
  selectedFile: File | null = null;
  doctorId: any;
  departmentData: any = []
  name: any
  selectedDepartmentId: string = '';
  constructor(private http: DoctorsService, private router: Router, private departments: DepartmentsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDepartments();
  }

  hidden = false;

  cancel() {
    this.dialog.closeAll();
  }

  // createDoctor() {
  //   this.dialog.open(AppAddDoctorComponent, {
  //     //  height: '95vh',
  //     width: '80vw',
  //   });
  // }

  getDepartments(): void {
    this.departments.getAllDepartments().subscribe((response) => {
      this.departmentData = response;
      console.log(this.departmentData)

      if (this.departmentData.length > 0) {
        this.selectedDepartmentId = this.departmentData[0]._id;
      }
    })
  }

  onSubmit(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to add this doctor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorData.departments = [this.selectedDepartmentId];
        this.http.createOrEdit(this.doctorData).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Doctor Added',
              text: 'Doctor Added Successfully',
            }).then(() => {
              this.dialog.closeAll();
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error creating the doctor data',
              confirmButtonText: 'OK',
            });
          }
        );
      }
    });
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
