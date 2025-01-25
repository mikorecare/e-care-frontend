import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatCardHeader, MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Doctor } from './models/doctor';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Department } from '../departments/model/department';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { DepartmentsService } from 'src/app/services/components/departments/departments.service';
import Swal from 'sweetalert2';
import { DoctorsService } from 'src/app/services/components/doctors/doctors.service';



@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit_doctor.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
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
    MatSelect,
    MatOption
  ],
  styleUrls: ['./doctor.component.scss'],

})
export class AppEditDoctorComponent implements OnInit {

  public doctor: Doctor = new Doctor();
  public department: Department = new Department();
  public departments: Department[] = [];

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private departmentApi: DepartmentsService,
    private http: DoctorsService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) { }

  private async fetchDoctorById(): Promise<void> {
    try {
      const doctorResponse = await fetch(
        `http://localhost:4000/api/admin/doctors/${this.data.id}`
      );
      const doctorData: Doctor = await doctorResponse.json() as Doctor;

      this.doctor = doctorData;

      this.doctor.image //this is the mimeType
      this.fetchDepartmentById(this.doctor.departments[0]);

      console.log(doctorData);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error fetching department:', error);
    }
  }

  private async fetchDepartmentById(departmentId: string): Promise<void> {
    try {
      const departmentResponse = await fetch(
        `http://localhost:4000/api/admin/departments/${departmentId}`
      );
      const departmentData: Department = await departmentResponse.json();
      this.department = departmentData;

      console.log(this.department);

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error fetching department:', error);
    }
  }

  private getAllDepartments(): void {
    this.departmentApi.getAllDepartments().subscribe((response) => {
      this.departments = response;

      this.cdr.detectChanges();
    });
  }  

  ngOnInit(): void {
    this.fetchDoctorById();
    this.getAllDepartments();
  }

  public changeDepartment(event: MatSelectChange) {
    const departmentId: string = event.value;

    this.doctor.departments[0] = departmentId;

    console.log(this.doctor);
  }

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  onSubmit(): void {
      console.log(this.department);
      Swal.fire({
        title: 'Are you sure?',
        text: 'Are you sure you want to update this doctor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          //this.doctorData.departments = [this.selectedDepartmentId];
          this.http.editDoctor(this.doctor).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Update Successful',
                text: 'Doctor Updated Successfully',
              }).then(() => {
                this.dialog.closeAll();
              });
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error updating the doctor data',
                confirmButtonText: 'OK',
              });
            }
          );
        }
      });
    }

    public cancel(): void {
      this.dialog.closeAll();
    }
}
