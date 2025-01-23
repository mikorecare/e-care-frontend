import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { register } from 'src/app/pages/authentication/side-register/model/register';
import { environment } from 'src/app/pages/environtment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  register(data: register): Observable<any> { 
    return this.http.post<any>(`${this.apiUrl}/users/signup`, data);
  }
}
