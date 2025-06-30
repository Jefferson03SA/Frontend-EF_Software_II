import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { UserInfoService, UserInfo } from '../../service/user/user-info.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
// Importar módulos de Angular Material necesarios
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  user: UserInfo | null = null;
  userName: string = 'Usuario';
  selectedMonth: string = (new Date().getMonth() + 1).toString().padStart(2, '0');
  selectedEstado: string = '';
  unreadCount: number = 0;
  private notificationsInterval: any;
  isDashboard = false;

  months = [
    { name: 'Enero', value: '01' }, { name: 'Febrero', value: '02' }, { name: 'Marzo', value: '03' },
    { name: 'Abril', value: '04' }, { name: 'Mayo', value: '05' }, { name: 'Junio', value: '06' },
    { name: 'Julio', value: '07' }, { name: 'Agosto', value: '08' }, { name: 'Septiembre', value: '09' },
    { name: 'Octubre', value: '10' }, { name: 'Noviembre', value: '11' }, { name: 'Diciembre', value: '12' }
  ];

  constructor(private userInfoService: UserInfoService, private http: HttpClient, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isDashboard = this.router.url.startsWith('/dashboard');
      }
    });
  }

  ngOnInit() {
    this.userInfoService.getUserInfo().subscribe({
      next: (user) => {
        this.user = user;
        this.userName = user?.username || 'Usuario';
      },
      error: () => {
        this.user = null;
        this.userName = 'Usuario';
      }
    });
    this.fetchUnreadNotifications();
    this.notificationsInterval = setInterval(() => this.fetchUnreadNotifications(), 30000);
  }

  ngOnDestroy() {
    if (this.notificationsInterval) {
      clearInterval(this.notificationsInterval);
    }
  }

  fetchUnreadNotifications() {
    this.http.get<any[]>(`${environment.apiUrl}/notificaciones`, { withCredentials: true }).subscribe({
      next: (data) => {
        // Suponiendo que cada notificación tiene una propiedad "read"
        this.unreadCount = Array.isArray(data) ? data.filter(n => n.read === false).length : 0;
      },
      error: () => {
        this.unreadCount = 0;
      }
    });
  }

  logout() {
    this.http.post(`${environment.apiUrl}/usuarios/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      },
      error: (err: any) => {
        console.error('Error al cerrar sesión en backend:', err);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    });
  }

  onMonthChange = (mes: string) => {
    this.selectedMonth = mes;
    // Aquí podrías emitir un evento global o usar un servicio para notificar al dashboard
  }

  onEstadoChange = (estado: string) => {
    this.selectedEstado = estado;
    // Aquí podrías emitir un evento global o usar un servicio para notificar al dashboard
  }
}
