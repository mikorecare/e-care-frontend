import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackService } from 'src/app/services/components/feedback/feedback.service';

@Component({
  selector: 'app-feedbacks',
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
  templateUrl: './feedbacks.component.html',
})
export class AppFeedbacksComponent implements OnInit {
  // The table columns to show
  displayedColumns: string[] = [
    'id',          // hidden in HTML
    'patientName', // replaced userId with a userName
    'department',
    'rate',        // dynamic star rating
    'message',     // from comments
    'date',        // from updatedAt
  ];

  data: any[] = []; // Will store the feedback data from the server

  constructor(private dialog: MatDialog, private feedback: FeedbackService) {}

  ngOnInit(): void {
    this.getAll();
  }

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  // Fetch all feedback
  getAll() {
    this.feedback.getAll().subscribe(
      async (response: any[]) => {
        this.data = response;
        console.log('Raw feedback data from server:', this.data);

        // For each feedback, we replace userId with a userName
        for (const item of this.data) {
          if (item.userId) {
            const user = await this.fetchUserById(item.userId);
            if (user?.firstname) {
              item.userName = user.firstname; // or user.lastname, up to you
            } else {
              // fallback
              item.userName = 'Unknown User';
            }
          } else {
            item.userName = 'No user?';
          }
        }

        console.log('All data after userId replaced:', this.data);
      },
      (error) => {
        console.error('Error fetching feedback data:', error);
      }
    );
  }

  // Look up user info by ID
  fetchUserById(userId: string): Promise<any> {
    return new Promise((resolve) => {
      this.feedback.getUserById(userId).subscribe(
        (resp) => {
          resolve(resp);
        },
        (err) => {
          console.error(`Error fetching user data for ID ${userId}:`, err);
          resolve(null);
        }
      );
    });
  }
}
