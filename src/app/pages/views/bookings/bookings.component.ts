import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { AppEditBookingComponent } from './edit_booking.component';
import { AppointmentsService } from 'src/app/services/components/appointments/appointments.service';
import { DepartmentsService } from 'src/app/services/components/departments/departments.service';
import { MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-bookings',
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
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class AppBookingsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'number',
    'patientName',
    'appointmentDate',
    'departmentName',
    'status',
    'actions',
  ];

  data: any[] = [];
  departmentData: any[] = [];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private dialog: MatDialog,
    private http: AppointmentsService,
    private department: DepartmentsService
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.getAllDepartment();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private getAllDepartment() {
    this.department.getAllDepartments().subscribe((response) => {
      this.departmentData = response;
      this.departmentData.unshift({ _id: 'all', name: 'All' });
    });
  }

  getAll() {
    this.http.getAll().subscribe(
      async (response: any[]) => {
        this.data = response;

        for (const item of this.data) {
          if (item.department) {
            const deptInfo = await this.fetchDepartmentById(item.department);
            item.departmentName = deptInfo?.name || 'N/A';
          }
          if (item.date?.$date?.$numberLong) {
            item.date = new Date(item.date.$date.$numberLong);
          }
        }

        console.log(this.data);
        this.dataSource.data = this.data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  fetchDepartmentById(departmentId: string): Promise<any> {
    return new Promise((resolve) => {
      this.department.getDepartmenById(departmentId).subscribe(
        (resp) => resolve(resp),
        (err) => {
          console.error(`Error fetching department data for ID ${departmentId}:`, err);
          resolve(null);
        }
      );
    });
  }

  editBooking(element: any) {
    const dialogRef = this.dialog.open(AppEditBookingComponent, {
      height: '100vh',
      data: { id: element._id },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAll();
    });
  }

  nameFilterChange(event: Event): void {
    const nameText: string = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filterPredicate = (data: any) => {
      const fullName = `${data.firstname} ${data.lastname}`.toLowerCase();
      return fullName.includes(nameText);
    };
    this.dataSource.filter = nameText;
  }

  statusFilterChange(event: MatSelectChange): void {
    const status = event.value;
    this.dataSource.filterPredicate = (data: any) => {
      return status === 'all' || data.status.toLowerCase() === status.toLowerCase();
    };
    this.dataSource.filter = status;
  }

  departmentFilterChange(event: MatSelectChange): void {
    const department = event.value;
    this.dataSource.filterPredicate = (data: any) => {
      return department === 'all' || data.department === department;
    };
    this.dataSource.filter = department;
  }

  dateFilterChange(event: any): void {
    const selectedDate = event.value;
    this.dataSource.filterPredicate = (data: any) => {
      const appointmentDate = new Date(data.date);
      return (
        !selectedDate || appointmentDate.toDateString() === new Date(selectedDate).toDateString()
      );
    };
    this.dataSource.filter = selectedDate || '';
  }
}