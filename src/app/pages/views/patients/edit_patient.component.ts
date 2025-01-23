import { Component, OnInit } from '@angular/core';
import { MatCardHeader, MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-edit_patient',
  templateUrl: './edit_patient.component.html',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatFormField, MatLabel, MatCardActions, MatCardModule, MatInputModule, MatButtonModule],
  styleUrls: ['./edit_patient.component.scss'],

})
export class AppEditPatientComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
