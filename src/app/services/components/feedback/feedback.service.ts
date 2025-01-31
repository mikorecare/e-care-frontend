import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/pages/environtment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/feedbacks`);
  }

  getUserById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  deleteFeedback(id: any, userId: string): Observable<any> {
    const token = localStorage.getItem("userData") || null;

    const headers = { Authorization: 'Bearer ' + JSON.parse(token!).token };

    return this.http.delete(`${this.apiUrl}/feedbacks/${id}/${userId}`);
  }
}
