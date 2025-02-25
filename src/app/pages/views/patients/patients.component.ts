import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Image } from './model/image.model';

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
export class AppPatientsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) public paginator: MatPaginator;

  displayedColumns: string[] = [
    'number',
    'id',
    'patientName',
    'contact',
    'address',
    'actions',
  ];
  public dataSource: User[] = [];
  public filteredDataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  public hidden: boolean = false;

  constructor(
    private dialog: MatDialog, 
    private http: UsersService,
  ) { }

  public ngOnInit(): void {
    this.getAll();
  }

  public ngAfterViewInit(): void {
    this.filteredDataSource.paginator = this.paginator;
  }

  public onImageError(event: Event): void {
    Image.onImageError(event);
  }

  public filterName(event: Event): void {
    const searchString: string = (event.target as HTMLInputElement).value.toLocaleUpperCase();

    if (searchString) {
      this.filteredDataSource.filterPredicate = ((user: User) => {
        return user.firstname.toLocaleUpperCase().includes(searchString)
          || user.lastname.toLocaleUpperCase().includes(searchString);
      });

      this.filteredDataSource.filter = searchString;
    }

    if (!searchString) {
      this.filteredDataSource.filter = "";
    }
  }

  public getAll(): void {
    this.http.getAllUsers().subscribe((response) => {
      this.dataSource = response;

      this.dataSource = this.dataSource.map((item: User) => {
        if (item.image) {
          const imageUrl = Image.createImageUrl(item.image);

          return { ...item, image: imageUrl };
        }

        const defaultImageUrl = Image.createImageUrl(new Image(null, "", "", "", 0, new Date()));

        return { ...item, image: defaultImageUrl };
      })

      this.filteredDataSource.data = this.dataSource;
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

  public editPatient(id: string): void {
    const dialogResponse = this.dialog.open(AppEditPatientComponent, {
       height: 'max-content',
      width: 'max-content',
      data: { id }
    });

    dialogResponse.afterClosed().subscribe(result => {
      this.getAll();
    });
  }

  deletePatient(element: any): void {
    console.log('Deleting doctor:', element);
  }
}
