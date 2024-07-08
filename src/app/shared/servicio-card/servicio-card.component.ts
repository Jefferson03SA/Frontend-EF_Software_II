import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../../service/deudas/servicios.service';

@Component({
  selector: 'app-servicio-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicio-card.component.html',
  styleUrls: ['./servicio-card.component.css']
})
export class ServicioCardComponent implements OnInit {
  @Input() servicio: any;

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit() {
    this.logFechas();
  }

  logFechas() {
    const hoy = new Date();
    const fechaVencimiento = new Date(this.servicio.fechaVencimiento);
    const fechaVencimientoAdjusted = new Date(fechaVencimiento);
    fechaVencimientoAdjusted.setDate(fechaVencimiento.getDate() + 0);

    const inicioSemanaActual = new Date(hoy);
    inicioSemanaActual.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1)); // Lunes de esta semana
    const finSemanaActual = new Date(inicioSemanaActual);
    finSemanaActual.setDate(inicioSemanaActual.getDate() + 6); // Domingo de esta semana

    const inicioSemanaProxima = new Date(finSemanaActual);
    inicioSemanaProxima.setDate(finSemanaActual.getDate() + 1); // Lunes de la próxima semana
    const finSemanaProxima = new Date(inicioSemanaProxima);
    finSemanaProxima.setDate(inicioSemanaProxima.getDate() + 6); // Domingo de la próxima semana

    console.log(`Hoy: ${hoy.toISOString().split('T')[0]} (${hoy.toLocaleDateString('en-US', { weekday: 'long' })})`);
    console.log(`Fecha de Vencimiento: ${fechaVencimiento.toISOString().split('T')[0]} (${fechaVencimiento.toLocaleDateString('en-US', { weekday: 'long' })})`);
    console.log(`Fecha de Vencimiento Ajustada: ${fechaVencimientoAdjusted.toISOString().split('T')[0]} (${fechaVencimientoAdjusted.toLocaleDateString('en-US', { weekday: 'long' })})`);
    console.log(`Inicio de Semana Actual: ${inicioSemanaActual.toISOString().split('T')[0]} (${inicioSemanaActual.toLocaleDateString('en-US', { weekday: 'long' })})`);
    console.log(`Fin de Semana Actual: ${finSemanaActual.toISOString().split('T')[0]} (${finSemanaActual.toLocaleDateString('en-US', { weekday: 'long' })})`);
    console.log(`Inicio de Semana Próxima: ${inicioSemanaProxima.toISOString().split('T')[0]} (${inicioSemanaProxima.toLocaleDateString('en-US', { weekday: 'long' })})`);
    console.log(`Fin de Semana Próxima: ${finSemanaProxima.toISOString().split('T')[0]} (${finSemanaProxima.toLocaleDateString('en-US', { weekday: 'long' })})`);
  }

  clearTime(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  getCardClass(): string {
    const hoy = this.clearTime(new Date());
    const fechaVencimiento = this.clearTime(new Date(this.servicio.fechaVencimiento));
    const fechaVencimientoAdjusted = new Date(fechaVencimiento);
    fechaVencimientoAdjusted.setDate(fechaVencimiento.getDate() + 1);

    const inicioSemanaActual = new Date(hoy);
    inicioSemanaActual.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1)); // Lunes de esta semana
    const finSemanaActual = new Date(inicioSemanaActual);
    finSemanaActual.setDate(inicioSemanaActual.getDate() + 6); // Domingo de esta semana

    const inicioSemanaProxima = new Date(finSemanaActual);
    inicioSemanaProxima.setDate(finSemanaActual.getDate() + 1); // Lunes de la próxima semana
    const finSemanaProxima = new Date(inicioSemanaProxima);
    finSemanaProxima.setDate(inicioSemanaProxima.getDate() + 6); // Domingo de la próxima semana

    if (this.servicio.estado === 'PAGADA') {
      return 'card-pagado';
    } else if (fechaVencimientoAdjusted < hoy) {
      return 'card-vencido';
    } else if (fechaVencimientoAdjusted.getTime() === hoy.getTime() || (fechaVencimientoAdjusted >= inicioSemanaActual && fechaVencimientoAdjusted <= finSemanaActual)) {
      return 'card-vencen-semana';
    } else if (fechaVencimientoAdjusted >= inicioSemanaProxima && fechaVencimientoAdjusted <= finSemanaProxima) {
      return 'card-por-vencer';
    } else {
      return 'card-por-vencer';
    }
  }

  marcarComoPagada(deudaId: number): void {
    this.serviciosService.marcarComoPagada(deudaId).subscribe(
      (response) => {
        this.servicio.estado = 'PAGADA';
      },
      (error) => {
        console.error('Error marcando la deuda como pagada', error);
      }
    );
  }
}
