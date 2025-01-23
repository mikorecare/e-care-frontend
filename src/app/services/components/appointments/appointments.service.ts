import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/pages/environtment'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private apiUrl = environment.apiUrl; // e.g. 'http://localhost:3000/api'

  constructor(private http: HttpClient) {}

  /**
   * CREATE or EDIT an appointment.
   * If id is provided, we do a PUT /appointments/:id
   * Otherwise, we do a POST /appointments
   */

  // Example adding Authorization header
createOrEdit(id: string, data: any): Observable<any> {
  const token = localStorage.getItem("userData") || null;

  const headers = { Authorization: 'Bearer ' +  JSON.parse(token!).token};
  if (id) {
    return this.http.put(`${this.apiUrl}/appointments/${id}`, data, { headers });
  } else {
    return this.http.post(`${this.apiUrl}/appointments`, data, { headers });
  }
}

  /** GET all appointments */
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/appointments/list`);
  }

  /** GET single appointment by ID */
  getAppointmentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/appointments/list/${id}`);
  }

 
  /**
   * GET total of all appointments
   * Actual endpoint: GET /appointments/total
   */
  getTotalBooking(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/appointments/total`);
  }
  
  getTotalCompleted(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/appointments/total/complete`);
  }

  getTotalUpcoming(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/appointments/total/upcoming`);
  }

  getTotalCancelled(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/appointments/total/cancelled`);
  }
}
