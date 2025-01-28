import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatCardHeader, MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DepartmentsService } from 'src/app/services/components/departments/departments.service';
import { CommonModule } from '@angular/common';
import { Department } from './model/department';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environtment';

@Component({
  selector: 'app-edit_department',
  templateUrl: './edit_department.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatFormField, MatLabel, MatCardActions, MatCardModule, MatInputModule, MatButtonModule],
  styleUrls: ['./add_department.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppEditDepartmentComponent implements OnInit {

  public department: Department = new Department();
  public imageUrl: string;
  private hidden: boolean = false;


  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private http: DepartmentsService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) { }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input?.files?.length) {
      const file = input.files[0];
      console.log('Selected file:', file.name, file.type, file.size);

      this.department.image = file;

      const formData = new FormData();
      formData.append('name', this.department.name);
      formData.append('description', this.department.description);
      formData.append('dailyQuota', this.department.dailyQuota.toString());
      formData.append('image', this.department.image);

      this.http.editDepartment(formData, this.department._id).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Update Photo Successful',
            text: 'Department Photo Updated Successfully',
          })
          .then(()=>{
            this.fetchDepartmentById(this.department._id);
            
            this.cdr.detectChanges();
          })
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error updating the department photo',
            confirmButtonText: 'OK',
          });
        }
      );

    } else {
      console.warn('No file selected');
    }
  }

  async ngOnInit(): Promise<void> {
    await this.fetchDepartmentById(this.data.id)
  }

  async fetchDepartmentById(departmentId: string): Promise<void> {
    try {
      const departmentResponse = await fetch(
        `http://localhost:4000/api/admin/departments/${departmentId}`
      );
      const departmentData: Department = await departmentResponse.json();
      this.department = departmentData;

      console.log(this.department);

      if(!this.department.image) {
        this.imageUrl = `${environment.defaultUrl}/uploads/default.jpg`;
      }

      if(this.department.image) {
        this.imageUrl = `${environment.defaultUrl}/uploads/${this.department.image.filename}`;
      }
      

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error fetching department:', error);
    }
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  onSubmit(): void {
    console.log(this.department);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to update this department?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        //this.doctorData.departments = [this.selectedDepartmentId];
        this.http.editDepartment(this.department, this.department._id).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Update Successful',
              text: 'Department Updated Successfully',
            }).then(() => {
              this.dialog.closeAll();
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error updating the department data',
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
