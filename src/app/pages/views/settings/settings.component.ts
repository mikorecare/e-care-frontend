import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environtment';
import { User } from '../patients/model/patients.model';
import { UsersService } from 'src/app/services/components/users/users.service';
import { Image } from '../patients/model/image.model';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { HeaderComponent } from 'src/app/layouts/full/header/header.component';



@Component({
  selector: 'app-settings',
  standalone: true,
  styleUrl: "./settings.component.scss",
  imports: [
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    TablerIconsModule,
    MatProgressBarModule,
    NgScrollbarModule,
    MatSlideToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './settings.component.html',
})

export class AppSettingsComponent implements OnInit {

  public imageUrl: string;
  public user: User;

  activeSection: string = 'appointment';

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  constructor(
    private http: UsersService,
    private cdr: ChangeDetectorRef,
    private global: GlobalService
  ) { }

  public async ngOnInit(): Promise<void> {
    await this.fetchUserById();
  }

  public onImageError(event: Event): void {
    Image.onImageError(event);
  }

  public async fetchUserById(): Promise<void> {
    const userData = JSON.parse(localStorage.getItem("userData") || "");

    const userId = userData.user._id;

    try {
      const userResponse = await fetch(
        `http://localhost:4000/api/admin/users/${userId}`
      );

      const userData: User = await userResponse.json();
      this.user = User.create(userData);

      const existingData = localStorage.getItem("userData");

      let userCached = { token: "", user: {} };
    
      if (existingData) {
        userCached = JSON.parse(existingData);
      }
    
      userCached.user = this.user;
    
      localStorage.setItem("userData", JSON.stringify(userCached)); // Save back

      this.global.globalUser = this.user;

      if (!this.user.image) {
        this.imageUrl = `${environment.defaultUrl}/uploads/default.jpg`;
      }

      if (this.user.image) {
        this.imageUrl = `${environment.defaultUrl}/uploads/${this.user.image.filename}`;
      }


      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error fetching department:', error);
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];
      console.log('Selected file:', file.name, file.type, file.size);

      this.user.image = file;

      const formData = new FormData();
      formData.append('firstname', this.user.firstname);
      formData.append('lastname', this.user.lastname);
      formData.append('email', this.user.email);
      formData.append('contactNumber', this.user.contactNumber);
      formData.append('image', this.user.image);

      this.http.editUser(this.user._id, formData).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Photo Upload',
            text: 'Photo Updated Successfully',
          })
            .then(async () => {
              await this.fetchUserById();

              this.cdr.detectChanges();
            })
        },
        (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error updating the user photo',
            confirmButtonText: 'OK',
          });
        }
      );

    } else {
      console.warn('No file selected');
    }
  }

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  public onSubmit(): void {
    const formData = new FormData();
    formData.append('firstname', this.user.firstname);
    formData.append('lastname', this.user.lastname);
    formData.append('email', this.user.email);
    formData.append('contactNumber', this.user.contactNumber);

    this.http.editUser(this.user._id, formData).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Update Info',
          text: 'Update Success',
        })
          .then(async () => {
            await this.fetchUserById();

            this.cdr.detectChanges();
          })
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error updating the user',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  public onPasswordChange(): void {
    if (this.user.newPassword !== this.user.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Your new and confirm password doesn\'t match ',
      })
    }

    if (this.user.newPassword === this.user.confirmPassword) {
      const formData = new FormData();
      
      formData.append('password', this.user.password);
      formData.append('newPassword', this.user.newPassword);

      this.http.changePassword(this.user._id, formData).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Password Update',
            text: 'Password changed successfully',
          })
            .then(async () => {
              await this.fetchUserById();

              this.cdr.detectChanges();
            })
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.error,
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }
}