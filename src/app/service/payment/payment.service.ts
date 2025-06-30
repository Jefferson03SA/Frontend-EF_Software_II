import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Payment {
  id: number;
  entity: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'late';
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  getPayments(month?: string, status?: string): Observable<Payment[]> {
    let url = `${environment.apiUrl}/api/payments`;
    const params: any = {};
    
    if (month) {
      params.month = month;
    }
    if (status && status !== 'all') {
      params.status = status;
    }

    return this.http.get<Payment[]>(url, { params });
  }

  createPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    return this.http.post<Payment>(`${environment.apiUrl}/api/payments`, payment);
  }

  updatePayment(id: number, payment: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${environment.apiUrl}/api/payments/${id}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/payments/${id}`);
  }
} 