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

  getDeudaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  actualizarDeuda(id: number, deuda: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, deuda, { withCredentials: true });
  }

  actualizarDeudaPatch(id: number, deuda: any): Observable<any> {
    // PATCH para actualizar parcialmente una deuda
    return this.http.patch<any>(`${this.apiUrl}/${id}`, deuda, { withCredentials: true });
  }

  eliminarDeuda(deudaId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${deudaId}`, { withCredentials: true });
  }

  procesarImagenOCR(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', file);
    // Agregar withCredentials para enviar cookies si el backend lo requiere
    return this.http.post<any>('http://localhost:8080/api/v1/ocr/procesar-imagen', formData, { withCredentials: true });
  }
}
