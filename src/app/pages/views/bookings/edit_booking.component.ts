import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  MatCardModule,
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardActions
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from 'src/app/services/components/appointments/appointments.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartmentsService } from 'src/app/services/components/departments/departments.service';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit_booking.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
    MatDatepickerModule,
    CommonModule,
    FormsModule,
  ],
  styleUrls: ['./edit_booking.component.scss'],
})
export class AppEditBookingComponent implements OnInit {
  /** The _id of this appointment */
  id: string;

  /** The appointment data to display & edit */
  data: any;
  public departmentName: string;
  public patientName: string;

  constructor(
    private appointment: AppointmentsService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<AppEditBookingComponent>,
    private department: DepartmentsService,
    private cdr: ChangeDetectorRef
  ) { }

  public ngOnInit(): void{
    // The appointment's _id from the parent component
    this.id = this.dialogData.id;
    this.getAppointmentById();
    
    this.cdr.detectChanges();
  }

  /** Fetch one appointment by ID */
  getAppointmentById() {
    this.appointment.getAppointmentById(this.id).subscribe({
      next: async (response) => {
        this.data = response;

        // If date is nested { $date: { $numberLong: ... } }, convert to a real JS Date
        if (this.data?.date?.$date?.$numberLong) {
          this.data.date = new Date(this.data.date.$date.$numberLong);
        }

        // If dateOfBirth is nested, you can convert as well
        if (this.data?.dateOfBirth?.$date?.$numberLong) {
          this.data.dateOfBirth = new Date(this.data.dateOfBirth.$date.$numberLong);
        }

        await this.fetchUserById(this.data?.userId);
        await this.fetchDepartmentById(this.data?.department);
        console.log('Appointment data loaded:', this.data);
      },
      error: (err) => {
        console.error('Error loading appointment:', err);
      },
    });
  }

  async fetchDepartmentById(departmentId: string): Promise<void> {
    try {
      await fetch(`http://localhost:4000/api/departments/${departmentId}`)
        .then(async data => await data.json())
        .then(data => {
          console.log(data);
          this.departmentName = data.name;

          this.cdr.detectChanges();
        }

        );
    } catch (error) {
      console.error(error);
    }
  }

  async fetchUserById(userId: string): Promise<void> {
    try {
      await fetch(`http://localhost:4000/api/users/${userId}`)
        .then(async data => await data.json())
        .then(data => {
          console.log(data);
          this.patientName = `${data.firstname} ${data.lastname}`;

          this.cdr.detectChanges();
        }

        );
    } catch (error) {
      console.error(error);
    }
  }

  /** Called when user clicks "Save" */
  onSubmit() {
    console.log('Attempting to save with data:', this.data);

    // If we have a JS Date, set a default time (9 AM) & convert to ISO
    if (this.data?.date instanceof Date) {
      this.data.date.setHours(9, 0, 0, 0);
      this.data.date = this.data.date.toISOString();
    }

    // Now update the record with (id, data)
    this.appointment.createOrEdit(this.id, this.data).subscribe({
      next: (res) => {
        console.log('Appointment updated successfully:', res);
        // Close the dialog on success
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Error updating appointment:', err);
      },
    });
  }
}
