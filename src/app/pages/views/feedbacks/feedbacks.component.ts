import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { GlobalService } from 'src/app/services/global.service';

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
  styles: [
    `
      .delete-btn {
        background-color: #fd2755ef;
        color: white;
        border-radius: 8px;
      }
    `
  ]
})
export class AppFeedbacksComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // The table columns to show
  displayedColumns: string[] = [
    'id',          // hidden in HTML
    'number',
    'patientName', // replaced userId with a userName
    'department',
    'rate',        // dynamic star rating
    'message',     // from comments
    'date',
    'action'       // from updatedAt
  ];

  public dataSource: Feedback[] = [];
  public hidden: boolean = false;
  public ratingArr: number[] = [1, 2, 3, 4, 5];
  public selectedRating: string | number = "all";

  public filteredDataSource = new MatTableDataSource<Feedback>();

  constructor(private dialog: MatDialog, private feedback: FeedbackService, private global: GlobalService) { }

  public ngOnInit(): void {
    this.getAll();
  }

  public ngAfterViewInit(): void {
    this.filteredDataSource.paginator = this.paginator;
  }

  public feedbackFilterChange(event: MatSelectChange): void {
    const ratingValue: string | number = event.value;

    console.log(ratingValue);
    if (ratingValue !== "all") {
      this.filteredDataSource.filterPredicate = (data: Feedback) => {

        return data.rate === ratingValue;
      };

      this.filteredDataSource.filter = ratingValue.toString();
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
      this.filteredDataSource.filterPredicate = ((feedback: Feedback) => {
        return feedback.userName.toLocaleUpperCase().includes(searchString);
      });
    }

    this.filteredDataSource.filter = searchString;

    if (!searchString) {
      this.revertDataSource();
    }
  }

  private revertDataSource(): void {
    this.filteredDataSource.filter = "";
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  // Fetch all feedback
  getAll() {
    this.feedback.getAll().subscribe(
      async (response: any[]) => {
        this.dataSource = response;

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

        this.filteredDataSource.data = this.dataSource;
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

  public deleteFeedback(id: string): void {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.feedback.deleteFeedback(id, this.global.globalUser._id)
          .subscribe(
            data => {
              if (data.message) {
                Swal.fire({
                  title: "Deleted!",
                  text: data.message,
                  icon: "success",
                  confirmButtonColor: "#3085d6",
                });
              }

              this.getAll();
            },
            (error: any) => {
              console.log(error.error)
              if (error.error) {
                Swal.fire({
                  title: "Error!",
                  text: error.error,
                  icon: "error",
                  confirmButtonColor: "#d33",
                });
              }
            }
          );
        Swal.fire("Deleted!", "Your feedback has been deleted.", "success");
      }
    });
  }
}
