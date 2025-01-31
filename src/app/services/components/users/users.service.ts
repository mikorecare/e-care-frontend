import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/pages/environtment';
import { User } from 'src/app/pages/views/patients/model/patients.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {

  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/list`);
  }

  getUserById(id: any): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  public editUser(id: string, data: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/profile/${id}`, data);
  }

  public changePassword(id: string, data: any): Observable<User>{
    return this.http.put<User>(`${this.apiUrl}/users/change-password/${id}`, data);
  }
}
