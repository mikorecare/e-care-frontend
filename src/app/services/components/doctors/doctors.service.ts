import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/pages/environtment';
import { doctor } from 'src/app/pages/views/doctors/models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  private apiUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/doctors`)
  }

  createOrEdit(data: doctor): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doctors`, data);
  }

  getDoctorById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/doctors/${id}`)
  }

  deleteDoctor(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/doctors/${id}`);
  }
  
}
