import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private apiUrl = `${environment.apiUrl}/deudas`;

  constructor(private http: HttpClient) { }

  getServiciosByFecha(mes: string): Observable<any> {
    const params = new HttpParams().set('mes', mes);
    const url = `${this.apiUrl}/consulta`;
    return this.http.get<any>(url, { params, withCredentials: true });
  }

  crearDeuda(deuda: any): Observable<any> {
    const url = `${this.apiUrl}/registro`;
    return this.http.post<any>(url, deuda, { withCredentials: true });
  }

  marcarComoPagada(deudaId: number): Observable<any> {
    const url = `${this.apiUrl}/${deudaId}/pagar`;
    return this.http.patch<any>(url, {}, { withCredentials: true });
  }
}
