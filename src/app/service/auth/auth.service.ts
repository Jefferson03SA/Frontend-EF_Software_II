import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private loginUrl = 'http://localhost:8080/api/v1/usuarios/login'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {
    // Verificar el estado de autenticación al inicializar el servicio
    const storedLoggedIn = localStorage.getItem('loggedIn');
    this.loggedIn = storedLoggedIn === 'true';
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials, { withCredentials: true });
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem('loggedIn');
    // Otras acciones de logout si es necesario, como eliminar cookies o tokens
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setLoggedIn(status: boolean) {
    this.loggedIn = status;
    localStorage.setItem('loggedIn', String(status));
  }
}
