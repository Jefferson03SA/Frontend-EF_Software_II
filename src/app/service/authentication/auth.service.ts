import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  private loggedIn = false;

  constructor(private http: HttpClient) {
    // Verificar el estado de autenticación al inicializar el servicio
    const storedLoggedIn = localStorage.getItem('loggedIn');
    this.loggedIn = storedLoggedIn === 'true';
  }

  register(user: { email: string, username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, user, { withCredentials: true });
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    this.loggedIn = false;
    localStorage.removeItem('loggedIn');
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setLoggedIn(status: boolean) {
    this.loggedIn = status;
    localStorage.setItem('loggedIn', String(status));
  }
}
