import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { UserInfoService } from '../../service/user/user-info.service';

// Modal para ingresar y verificar número WhatsApp
@Component({
  selector: 'whatsapp-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whatsapp-modal.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class WhatsappModalComponent {
  phoneNumber = '';
  error = '';
  loading = false;
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<WhatsappModalComponent>
  ) {}
  verify() {
    this.error = '';
    this.loading = true;
    this.dialogRef.close(this.phoneNumber);
  }
  onCancel() { this.dialogRef.close(); }
}

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesComponent implements OnInit {
  settings = {
    autoReminders: true,
    whatsappNotifications: false,
    language: 'es'
  };

  whatsappNumber: string | null = null;
  whatsappSessionActive: boolean = false;
  userId: number | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private userInfoService: UserInfoService
  ) {}

  ngOnInit() {
    // Prueba: mostrar la respuesta cruda del backend
    this.userInfoService.getUserInfoRaw().subscribe({
      next: (raw) => {
        console.log('[Ajustes][DEBUG] Respuesta cruda de /usuarios/check-auth:', raw);
      },
      error: (err) => {
        console.error('[Ajustes][DEBUG] Error crudo de /usuarios/check-auth:', err);
      }
    });
    // Lógica normal
    this.userInfoService.getUserInfo().subscribe({
      next: (user) => {
        console.log('[Ajustes] getUserInfo() respuesta:', user);
        if (user && user.id != null) {
          this.userId = user.id;
          console.log('[Ajustes] userId asignado:', this.userId);
        } else {
          this.userId = null;
          console.warn('[Ajustes] Usuario sin id válido:', user);
        }
        this.cargarEstadoWhatsapp();
      },
      error: (err) => {
        this.userId = null;
        console.error('[Ajustes] Error al obtener usuario autenticado:', err);
        if (err && err.error) {
          console.error('[Ajustes] Detalle error backend:', err.error);
        }
        this.cargarEstadoWhatsapp();
      }
    });
  }

  cargarEstadoWhatsapp() {
    this.http.get<any>(`${environment.apiUrl}/usuarios/me/whatsapp`, { withCredentials: true }).subscribe({
      next: (res) => {
        if (res && res.phoneNumber) {
          this.whatsappNumber = res.phoneNumber;
          // Consultar el estado real de la sesión usando el número
          if (this.whatsappNumber) {
            this.http.get<any>(`${environment.apiUrl}/whatsapp/session/status?phoneNumber=${encodeURIComponent(this.whatsappNumber)}`, { withCredentials: true }).subscribe({
              next: (statusRes) => {
                // Si el backend responde true, la sesión está activa
                if (statusRes === true || statusRes?.active === true || statusRes?.isActive === true) {
                  this.whatsappSessionActive = true;
                  this.settings.whatsappNotifications = true;
                } else {
                  this.whatsappSessionActive = false;
                  this.settings.whatsappNotifications = false;
                }
              },
              error: () => {
                this.whatsappSessionActive = false;
                this.settings.whatsappNotifications = false;
              }
            });
          } else {
            this.whatsappSessionActive = false;
            this.settings.whatsappNotifications = false;
          }
        } else {
          this.whatsappNumber = null;
          this.whatsappSessionActive = false;
          this.settings.whatsappNotifications = false;
        }
      },
      error: () => {
        this.whatsappNumber = null;
        this.whatsappSessionActive = false;
        this.settings.whatsappNotifications = false;
      }
    });
  }

  onWhatsappToggle() {
    if (!this.settings.whatsappNotifications) {
      // Pausar
      if (this.whatsappNumber) {
        this.http.put(`${environment.apiUrl}/whatsapp/session/status?phoneNumber=${encodeURIComponent(this.whatsappNumber)}&isActive=false`, {}, { withCredentials: true }).subscribe({
          next: () => {
            this.whatsappSessionActive = false;
          }
        });
      } else {
        this.whatsappSessionActive = false;
      }
    } else {
      // Si no hay número, forzar modal
      if (!this.whatsappNumber) {
        if (!this.userId) {
          this.settings.whatsappNotifications = false;
          alert('No se pudo obtener el usuario autenticado. Intenta recargar la página.');
          return;
        }
        const dialogRef = this.dialog.open(WhatsappModalComponent, { width: '340px' });
        dialogRef.afterClosed().subscribe((result: string | null) => {
          if (result) {
            this.http.post<any>(`${environment.apiUrl}/whatsapp/session/start?phoneNumber=${encodeURIComponent(result)}&userId=${this.userId}`, {}, { withCredentials: true }).subscribe({
              next: (response) => {
                this.whatsappNumber = result;
                this.whatsappSessionActive = true;
                this.settings.whatsappNotifications = true;
              },
              error: (err) => {
                this.settings.whatsappNotifications = false;
                alert(err?.error?.message || 'Error al registrar el número.');
              }
            });
          } else {
            this.settings.whatsappNotifications = false;
          }
        });
        return; // Importante: no seguir con la activación si no hay número
      }
      // Reactivar (o activar si ya hay número)
      this.http.put(`${environment.apiUrl}/whatsapp/session/status?phoneNumber=${encodeURIComponent(this.whatsappNumber)}&isActive=true`, {}, { withCredentials: true }).subscribe({
        next: (res: any) => {
          this.whatsappSessionActive = true;
        },
        error: (err) => {
          if (err.status === 200) {
            this.whatsappSessionActive = true;
          } else {
            this.whatsappSessionActive = false;
            this.settings.whatsappNotifications = false;
            alert('Error al activar WhatsApp.');
          }
        }
      });
    }
    // Sincronizar siempre: si el switch está en off, ocultar el botón; si está en on, mostrarlo
    this.whatsappSessionActive = this.settings.whatsappNotifications;
  }

  cerrarSesionWhatsapp() {
    if (!this.whatsappNumber) return;
    this.http.delete(`${environment.apiUrl}/whatsapp/session/unlink?phoneNumber=${encodeURIComponent(this.whatsappNumber)}`, { withCredentials: true })
      .subscribe({
        next: () => {
          this.whatsappNumber = null;
          this.whatsappSessionActive = false;
          this.settings.whatsappNotifications = false;
        }
      });
  }

  saveSettings() {
    const payload = {
      ...this.settings,
      whatsappNumber: this.whatsappNumber
    };
    console.log('Settings saved:', payload);
  }
}