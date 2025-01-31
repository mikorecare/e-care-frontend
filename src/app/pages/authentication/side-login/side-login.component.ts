import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from 'src/app/services/auth/login/login.service';
import { login } from './model/login';
import Swal from 'sweetalert2';
import { GlobalService } from 'src/app/services/global.service';
import { Admin, User } from '../../views/patients/model/patients.model';


@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  data: login
  loginData: any
  constructor(
    private router: Router, 
    private http: LoginService,
     private global: GlobalService
  ) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.valid) {
      console.log(this.form);
      this.loginData = this.form.value;
  
      // Make the login HTTP request
      this.http.login(this.loginData).subscribe({
        next: (response) => {

          this.global.globalUser = new Admin(response.user);

          localStorage.setItem('userData', JSON.stringify(response));
          Swal.fire({
            title: 'Success!',
            text: 'Login Successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/dashboard']); // Navigate on successful login
        },
        error: (error) => {
          if (error.status === 401) {
            // Handle 401 Unauthorized
            Swal.fire({
              title: 'Error!',
              text: 'Invalid Email and Password',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            // Handle other errors
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });
    } else {
      // Handle form invalid case
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out the form correctly.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  
}
