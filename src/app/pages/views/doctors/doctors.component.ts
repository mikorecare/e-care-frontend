import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Image } from '../patients/model/image.model';

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
export class AppDoctorsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) public paginator: MatPaginator;

  displayedColumns: string[] = [
    'number',
    'id',
    'doctorName',
    'specialty',
    'department',
    'contact',
    'status',
    'actions',
  ];

  public dataSource: Doctor[] = [];
  public filteredDataSource: MatTableDataSource<Doctor> = new MatTableDataSource<Doctor>();
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

  public ngOnInit(): void {
    this.getAll();
    this.getAllDepartments();
  }

  public ngAfterViewInit(): void {
    this.filteredDataSource.paginator = this.paginator;
  }

  private getAllDepartments(): void {
    const subscription: Subscription = this.department.getAllDepartments().subscribe((response) => {
      this.departments = response;

      subscription.unsubscribe();
    });
  }

  private getAll(): void {
    this.http.getAll().subscribe((response) => {
      this.data = response;

      this.data = this.data.map((doctor: Doctor) => {
        if (doctor.image) {
          const imageUrl = Image.createImageUrl(doctor.image);

          return { ...doctor, image: imageUrl };
        }

        const defaultImageUrl = Image.createImageUrl(new Image(null, "", "", "", 0, new Date()));

        return { ...doctor, image: defaultImageUrl };
      });

      this.filteredDataSource.data = this.data;
    });
  }

  public onImageError(event: Event): void {
    Image.onImageError(event);
  }

  public editDoctor(id: string) {
    const dialogResponse = this.dialog.open(AppEditDoctorComponent, {
      height: '100vh',
      data: { id }
    });

    dialogResponse.afterClosed().subscribe(result => {
      this.getAll();
    });
  }

  public createDoctor() {
    const dialogResponse = this.dialog.open(AppAddDoctorComponent, {
      //  height: '95vh',
      width: '80vw',
    });

    dialogResponse.afterClosed().subscribe(result => {
      this.getAll();
    });
  }

  public departmentFilterChange(event: MatSelectChange): void {
    const department = (event.value).toLocaleUpperCase();

    if (department !== "ALL") {
      this.filteredDataSource.filterPredicate = ((obj: Doctor) => {
        const departmentsInvolved = obj.departments.map((data) => data.name.toLocaleUpperCase());

        return departmentsInvolved.includes(department.toLocaleUpperCase());
      });

      this.filteredDataSource.filter = department;

      return;
    }

    if (department === "ALL") {
      this.filteredDataSource.data = this.data;

      this.filteredDataSource.filter = "";
      return;
    }

    throw new Error("Option not implemented");
  }

  private getDepartmentById() {
    this.department.getDepartmenById(this.departmentId).subscribe((response) => {
      this.departmentData = response;
    })
  }

  private toggleBadgeVisibility(): void {
    this.hidden = !this.hidden;
  }

  public deleteDoctor(id: any): void {
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
            Swal.fire('Error!', 'Failed to delete doctor', error);
          }
        );
      }
    });
  }
}
