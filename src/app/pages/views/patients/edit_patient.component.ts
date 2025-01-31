import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatCardHeader, MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/components/users/users.service';
import { Patient, User } from './model/patients.model';
import { environment } from '../../environtment';
import { Image } from './model/image.model';
import { CommonModule, DatePipe } from '@angular/common';



@Component({
  selector: 'app-edit_patient',
  templateUrl: './edit_patient.component.html',
  standalone: true,
  imports: [
  CommonModule,
   DatePipe, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatFormField, MatLabel, MatCardActions, MatCardModule, MatInputModule, MatButtonModule],
  styleUrls: ['./edit_patient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppEditPatientComponent implements OnInit {

  public user: Patient = new Patient();
  public imageUrl: string;

  constructor(
    private dialog: MatDialog,
    private http: UsersService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) { }

  public async ngOnInit(): Promise<void> {
    await this.fetchUserById(this.data.id)
  }

  public onImageError(event: Event) {
    Image.onImageError(event);
  }

  async fetchUserById(userId: string): Promise<void> {
      try {
        const departmentResponse = await fetch(
          `http://localhost:4000/api/admin/users/patients/${userId}`
        );
        const userData: User = await departmentResponse.json();
        this.user = userData;
  
        console.log(this.user);
  
        if(!this.user.image) {
          this.imageUrl = `${environment.defaultUrl}/uploads/default.jpg`;
        }
  
        if(this.user.image) {
          this.imageUrl = `${environment.defaultUrl}/uploads/${this.user.image.filename}`;
        }
        
  
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Error fetching department:', error);
      }
    }

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
