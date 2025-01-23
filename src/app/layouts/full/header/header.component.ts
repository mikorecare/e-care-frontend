import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from 'src/app/services/components/users/users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, MaterialModule, MatButtonModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent implements OnInit{
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  id: any
  data: any
  constructor(private user: UsersService) {

  }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const userId = parsedData.user._id;

      if (userId) {
        this.getUserById(userId)
      } else {
        console.log('User ID is empty');
      }
    } else {
      console.log('User data is empty');
    }
  }

  getUserById(id: any) {
    this.user.getUserById(id).subscribe((response) => {
      this.data = response
      console.log(this.data)
    })
  } 
}
