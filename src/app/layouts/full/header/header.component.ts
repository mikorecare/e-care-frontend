import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from 'src/app/services/components/users/users.service';
import { AuthMiddlewareApi } from 'src/app/services/auth-middleware/auth-middleware.api.service';
import { GlobalService } from 'src/app/services/global.service';
import { Admin } from 'src/app/pages/views/patients/model/patients.model';
import { Image } from 'src/app/pages/views/patients/model/image.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, MaterialModule, MatButtonModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})

export class HeaderComponent implements OnInit{
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  id: any
  data: any

  public get imageUrl(): string {
    return this.global.imageUrl;
  }

  constructor(
    private user: UsersService,
    private auth: AuthMiddlewareApi,
    private router: Router,
    private global: GlobalService,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');

    if(!this.global.globalUser && userData) {
      
      this.global.globalUser = new Admin(JSON.parse(userData).user);
    }

    if (userData) {
      const parsedData = JSON.parse(userData).user._id;

      if (parsedData) {
        this.getUserById(parsedData)
      } else {
        console.log('User ID is empty');
      }
    } else {
      console.log('User data is empty');
    }

    this.cdr.markForCheck();
  }

  public logout(): void {
    this.auth.logout();
    this.router.navigate(['/authentication/login']);
  }

  getUserById(id: any) {
    this.user.getUserById(id).subscribe((response) => {
      this.data = response
    })
  } 
}
