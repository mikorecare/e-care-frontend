import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/pages/environtment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { 

  }

  getAllDepartments(): Observable<any> { 
    return this.http.get(`${this.apiUrl}/departments`)
  }

  createOrEditDepartment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/departments`, data)
  }

  editDepartment(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/departments`, data);
  }

  getDepartmenById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments/${id}`)
  }

  deleteDepartment(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/departments/${id}`)
  }
}
