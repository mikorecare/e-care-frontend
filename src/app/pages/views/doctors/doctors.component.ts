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
import { Doctor } from './models/doctor';
import { Subscription } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

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

  public dataSource: Doctor[] = [];
  public filteredDataSource: Doctor[] = [];
  public departments: Department[] = [];
  public hidden: boolean = false;

  selectedDoctor: any = null;
  departmentId: any
  departmentData: any
  data: any;

  constructor(
    private dialog: MatDialog,
    private http: DoctorsService,
    private cbr: ChangeDetectorRef,
    private department: DepartmentsService
  ) { }

  editDoctor(id: string) {
    const dialogResponse = this.dialog.open(AppEditDoctorComponent, {
      height: '100vh',
      data: { id }
    });

    dialogResponse.afterClosed().subscribe(result => {
      this.getAll();
    });
  }

  createDoctor() {
    const dialogResponse = this.dialog.open(AppAddDoctorComponent, {
      //  height: '95vh',
      width: '80vw',
    });

    dialogResponse.afterClosed().subscribe(result => {
      this.getAll();
    });
  }

  public ngOnInit(): void {
    this.getAll();
    this.getAllDepartments();
  }

  getAll(): void {
    this.http.getAll().subscribe((response) => {
      this.data = response;
      this.filteredDataSource = response;

      console.log(response);
    });
  }

  private getAllDepartments() {
    const subscription: Subscription = this.department.getAllDepartments().subscribe((response) => {
      this.departments = response;

      subscription.unsubscribe();
    });
  }

  public departmentFilterChange(event: MatSelectChange): void {
    const department = (event.value).toLocaleUpperCase();

    if (department !== "all") {
      this.filteredDataSource = this.data.filter((obj: Doctor) => {
        const departmentsInvolved = obj.departments.map((data) => data.name.toLocaleUpperCase());

        return departmentsInvolved.includes(department.toLocaleUpperCase());
      });

      return;
    }

    if (department === "all") {
      this.filteredDataSource = this.data;

      return;
    }

    throw new Error("Option not implemented");
  }

  getDepartmentById() {
    this.department.getDepartmenById(this.departmentId).subscribe((response) => {
      this.departmentData = response;
      console.log(this.departmentData)
    })
  }

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
