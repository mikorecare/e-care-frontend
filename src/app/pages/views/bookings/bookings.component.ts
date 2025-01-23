import { Component, OnInit } from '@angular/core';
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
  displayedColumns: string[] = [
    'patientName',
    'appointmentDate',
    'departmentName',
    'status',
    'actions'
  ];
  
  data: any[] = []; // Will store data from your backend

  public departmentData: any[] = [];
  public filteredDatasource: any[] = [];

  constructor(
    private dialog: MatDialog,
    private http: AppointmentsService,
    private department: DepartmentsService
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.getAllDepartment();
    
  }

  private getAllDepartment() {
    this.department.getAllDepartments().subscribe(
      async (response) => {
        this.departmentData = response;
        this.departmentData.unshift({_id: "all", name: "All"});
      }
    )
  }

  // Fetch all appointment data from the backend
  getAll() {
    this.http.getAll().subscribe(
      async (response: any[]) => {
        this.data = response;
        console.log(this.data);
        // For each item, fetch the department name by ID
        for (const item of this.data) {
          if (item.department) {
            const deptInfo = await this.fetchDepartmentById(item.department);
            item.departmentName = deptInfo?.name || 'N/A';
          }

          // Convert item.date (if in Mongo format) to JS Date
          if (item.date && item.date.$date && item.date.$date.$numberLong) {
            item.date = new Date(item.date.$date.$numberLong);
          }
        }

        this.filteredDatasource = this.data;
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
    // Open the edit dialog
    const dialogRef = this.dialog.open(AppEditBookingComponent, {
      height: '100vh',
      data: { id: element._id },
    });

    // After the dialog closes, refresh data to see changes
    dialogRef.afterClosed().subscribe(() => {
      this.getAll();
    });
  }

  public nameFilterChange(event: Event): void {
    const nameText: string = (event.target as HTMLInputElement).value;

    if(nameText) {
      this.filteredDatasource = this.data.filter((obj)=>{
        const nameConcat = obj.firstname.toLocaleUpperCase() + " "  + obj.lastname.toLocaleUpperCase();

        return nameConcat.trim().toLocaleUpperCase().includes(nameText.toLocaleUpperCase());
      });

      return;
    }

    if(!nameText) {
      this.filteredDatasource = this.data;

      return;
    }

    throw new Error("Method not implemented");
  }

  public statusFilterChange(event: MatSelectChange): void {
    const status = event.value;

    if (status !== "all") {
      this.filteredDatasource = this.data.filter((obj)=>{
        return obj.status.toLocaleUpperCase() === status.toLocaleUpperCase(); 
      });

      return;
    }

    if (status === "all") {
      this.filteredDatasource = this.data;
      
      return;
    }

    throw new Error("Option not implemented");
  }

  public departmentFilterChange(event: MatSelectChange): void {
    const department = event.value;

    if (department !== "all") {
      this.filteredDatasource = this.data.filter((obj)=>{
        return obj.department.toLocaleUpperCase() === department.toLocaleUpperCase(); 
      });

      return;
    }

    if (department === "all") {
      this.filteredDatasource = this.data;
      
      return;
    }

    throw new Error("Option not implemented");
  }

  public dateFilterChange(event: any): void {
    const selectedDate = event.value;

    if(selectedDate) {
      const finalDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      }).format(selectedDate);

      this.filteredDatasource = this.data.filter((obj: any) => {
        const tempDate = new Date(obj.date);

        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        }).format(tempDate) === finalDate;
      });
    }

    if(!selectedDate) {
      this.filteredDatasource = this.data;
    }
  }
}
