import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppAddDoctorComponent implements OnInit {
  doctorData: Doctor = new Doctor();
  selectedFile: File | null = null;
  doctorId: any;
  departmentData: any = []
  name: any
  selectedDepartmentId: string = '';
  
  public imageUrl: string = "";

  constructor(
    private http: DoctorsService, 
    private router: Router, 
    private readonly departments: DepartmentsService, 
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getDepartments();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];

      this.doctorData.image = file;
      
      this.imageUrl = URL.createObjectURL(file);
      
      this.cdr.detectChanges();

    } else {
      console.warn('No file selected');
    }
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

      if (this.departmentData.length > 0) {
        this.selectedDepartmentId = this.departmentData[0]._id;
      }
    })
  }

  onSubmit(): void {

    const formData: FormData = new FormData();

    formData.append("name", this.doctorData.name);
    formData.append("specialization", this.doctorData.specialization);
    formData.append("departments", JSON.stringify([this.selectedDepartmentId]));
    formData.append("image", this.doctorData.image);

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
        this.http.createOrEdit(formData).subscribe(
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
