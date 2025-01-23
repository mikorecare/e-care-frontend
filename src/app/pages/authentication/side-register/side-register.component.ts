import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { RegisterService } from 'src/app/services/auth/register/register.service';
import { register } from './model/register';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  data: register;
  registerData: any
  constructor(private router: Router, private http: RegisterService) {}

  form = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  get f() {
    return this.form.controls;
  }

  submit(): void {
    // console.log(this.form.value);
    if (this.form.valid) {
      console.log(this.form)
      this.registerData = this.form.value;
      this.http.register(this.registerData).subscribe((response) => {
        console.log(response)
      })
      this.router.navigate(['/authentication/login']);
    }
    
  }
}
