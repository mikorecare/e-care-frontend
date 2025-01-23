import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/pages/environtment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {

  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/list`);
  }

  getUserById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }
}
