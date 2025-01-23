import { Component, OnInit } from '@angular/core';
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



@Component({
    selector: 'app-settings',
    standalone: true,
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
    ],
    templateUrl: './settings.component.html',
})

export class AppSettingsComponent implements OnInit {
    dailyQuota: number = 50; 
    emailNotifications: boolean = true;
    allowOverbooking: boolean = true;
    email: string = 'johndoe@gmail.com';
    lastName: string = 'Smith';
    firstName: string = 'John Doe';
    durations = ['15 minutes', '30 minutes', '45 minutes', '1 hour'];
    selectedDuration: string = '30 minutes';

    activeSection: string = 'appointment'; 

    profileImage: '../../../../assets/images/profile/user-5.jpg./assets/images/profile/user-5.jpg';

    setActiveSection(section: string): void {
      this.activeSection = section;
    }

    constructor() { }

    ngOnInit(): void {}

    hidden = false;

    toggleBadgeVisibility() {
      this.hidden = !this.hidden;
    }
  }