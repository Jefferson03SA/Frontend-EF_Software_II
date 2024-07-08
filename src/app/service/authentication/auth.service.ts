import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  register(user: { email: string, username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, user, { withCredentials: true });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }
}
