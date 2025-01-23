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
import { MatDialog } from '@angular/material/dialog';
import { DepartmentsService } from 'src/app/services/components/departments/departments.service';
import { Department } from './model/department';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add_department.component.html',
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
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./add_department.component.scss'],
  
})
export class AppAddDepartmentComponent implements OnInit {
  department: Department = new Department();
  data: any
  constructor(private dialog: MatDialog, private http: DepartmentsService) { }

  ngOnInit(): void {

  }

 

  hidden = false;

  cancel() {
    this.dialog.closeAll();
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
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
          //this.doctorData.departments = [this.selectedDepartmentId];
          this.http.createOrEditDepartment(this.department).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Department Added',
                text: 'Department Added Successfully',
              }).then(() => {
                this.dialog.closeAll();
              });
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error creating the department data',
                confirmButtonText: 'OK',
              });
            }
          );
        }
      });
    }
}
