import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private apiUrl = `${environment.apiUrl}/prestamos`;

  constructor(private http: HttpClient) { }

  getPrestamos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { withCredentials: true });
  }

  crearPrestamo(prestamo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, prestamo, { withCredentials: true });
  }

  getPrestamoDetalle(prestamoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${prestamoId}/cronograma`, { withCredentials: true });
  }

  marcarCuotaComoPagada(prestamoId: number, numero: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${prestamoId}/cronograma/${numero}/pagar`, {}, { withCredentials: true });
}

}
