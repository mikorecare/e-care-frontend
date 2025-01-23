import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { AppAddDepartmentComponent } from './add_department.component';
import { AppEditDepartmentComponent } from './edit_department.component';
import { DepartmentsService } from 'src/app/services/components/departments/departments.service';
import Swal from 'sweetalert2';

export interface departmentData {
  id: number;
  departmentImage: string;
  departmentName: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    TablerIconsModule,
    MatProgressBarModule,
    NgScrollbarModule,
  ],
  templateUrl: './departments.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppDepartmentsComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  
  constructor(
    private dialog: MatDialog, 
    private department: DepartmentsService,
    private cdr: ChangeDetectorRef
  )
     { }
  

  ngOnInit(): void {
    this.getAll();
  }

  createDepartment() {
    this.dialog.open(AppAddDepartmentComponent, {
      //  height: '95vh',
      width: '80vw',
    });
  }

  nameFilter(event: Event): void {
    const nameFilterValue: string = (<HTMLInputElement>event.target).value;

    if(nameFilterValue) {
      this.filteredData = this.data.filter((obj)=>{
      
        return obj.name.trim().toLocaleUpperCase().includes(nameFilterValue.toLocaleUpperCase());
      });

      return; 
    }

    if(!nameFilterValue) {
      this.filteredData = this.data;

      return;
    }

    throw new Error("Method not implemented");
  }

  editDepartment(id: string) {
    const dialogResponse = this.dialog.open(AppEditDepartmentComponent, {
      //  height: '95vh',
      width: '80vw',
      data: {id}
    });

    dialogResponse.afterClosed().subscribe(result => {
        this.getAll();
    });
  }

  getAll() {
    this.department.getAllDepartments().subscribe((response) => {
      this.data = response;
      this.filteredData = response;

      this.cdr.detectChanges();
    })
  }  

  deleteDepartment(id: any) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.department.deleteDepartment(id).subscribe((response) => {
            this.getAll();
            Swal.fire(
              'Deleted!',
              'Your department has been deleted.',
              'success'
            )
          }, error => {
            console.error('Error deleting department', error)
            Swal.fire(
              'Error!',
              'Failed to delete department',
              'error'
            );
          })
        }
      })
    }
  

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  public refresh(): void {
    this.cdr.detectChanges();
  }
}
