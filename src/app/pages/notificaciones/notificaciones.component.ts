import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  date: string;
  read: boolean;
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Notification[]>('http://localhost:8080/api/v1/notificaciones', { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.notifications = data;
        },
        error: (err) => {
          console.error('Error al obtener notificaciones:', err);
        }
      });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'check_circle';
      default:
        return 'notifications';
    }
  }

  markAsRead(id: number) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }
}