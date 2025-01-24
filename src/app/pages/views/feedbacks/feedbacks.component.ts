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
import { Feedback } from './model/feedback.model';
import { FormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
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

  public dataSource: Feedback[] = [];
  public filteredDataSource: Feedback[] = [];
  public hidden: boolean = false;
  public ratingArr: number[] = [1, 2, 3, 4, 5];
  public selectedRating: string | number = "all";

  constructor(private dialog: MatDialog, private feedback: FeedbackService) { }

  public ngOnInit(): void {
    this.getAll();
  }

  public feedbackFilterChange(event: MatSelectChange): void {
    const ratingValue: string | number = event.value;

    console.log(ratingValue);
    if (ratingValue !== "all") {
      this.filteredDataSource = this.dataSource.filter((feedback: Feedback) => {
        return feedback.rate === ratingValue;
      });

      return;
    }

    if (ratingValue === "all") {
      this.revertDataSource();

      return;
    }

    throw new Error("method not implemented");
  }

  public filterName(event: Event): void {
    const searchString: string = (event.target as HTMLInputElement).value.toLocaleUpperCase();

    if (searchString) {
      this.filteredDataSource = this.dataSource.filter((feedback: Feedback) => {
        return feedback.userName.toLocaleUpperCase().includes(searchString);
      });
    }

    if (!searchString) {
      this.revertDataSource();
    }
  }

  private revertDataSource(): void {
    this.filteredDataSource = this.dataSource;
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  // Fetch all feedback
  getAll() {
    this.feedback.getAll().subscribe(
      async (response: any[]) => {
        this.dataSource = response;
        console.log('Raw feedback data from server:', this.dataSource);

        // For each feedback, we replace userId with a userName
        for (const item of this.dataSource) {
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

        this.filteredDataSource = this.dataSource;
        console.log('All data after userId replaced:', this.dataSource);
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
