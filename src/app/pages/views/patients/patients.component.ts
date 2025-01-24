import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { AppEditPatientComponent } from './edit_patient.component';
import { AppAddPatientComponent } from './add_patient.component';
import { UsersService } from 'src/app/services/components/users/users.service';
import { User } from './model/patients.model';

export interface patientsData {
  id: number;
  patientName: string;
  profileImage: string;
  contact: string;
  address: string;
}

@Component({
  selector: 'app-patients',
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
  templateUrl: './patients.component.html',
})
export class AppPatientsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'patientName',
    'contact',
    'address',
    'actions',
  ];
  public dataSource: User[] = [];
  public filteredDataSource: User[] = [];
  public hidden: boolean = false;

  constructor(private dialog: MatDialog, private http: UsersService) { }

  ngOnInit(): void {
    this.getAll();
  }

  public filterName(event: Event): void {
    const searchString: string = (event.target as HTMLInputElement).value.toLocaleUpperCase();

    if (searchString) {
      this.filteredDataSource = this.dataSource.filter((user: User) => {
        return user.firstname.toLocaleUpperCase().includes(searchString)
          || user.lastname.toLocaleUpperCase().includes(searchString);
      });
    }

    if (!searchString) {
      this.filteredDataSource = this.dataSource;
    }
  }

  public getAll(): void {
    this.http.getAllUsers().subscribe((response) => {
      this.dataSource = response;
      this.filteredDataSource = response;
      console.log(this.dataSource);
    })
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  addPatient() {
    this.dialog.open(AppAddPatientComponent, {
      height: '100vh',
    });
  }

  editPatient(element: any) {
    this.dialog.open(AppEditPatientComponent, {
      height: '100vh',
    });
  }

  deletePatient(element: any): void {
    console.log('Deleting doctor:', element);
  }
}
