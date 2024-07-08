import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrestamoService } from '../../service/prestamos/prestamo.service';

@Component({
  selector: 'app-prestamo-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prestamo-detalle.component.html',
  styleUrls: ['./prestamo-detalle.component.css'],
  providers: [PrestamoService]
})
export class PrestamoDetalleComponent implements OnInit {
  prestamoId: number | null = null;
  prestamo: any = null;

  constructor(
    private route: ActivatedRoute,
    private prestamoService: PrestamoService
  ) {}

  ngOnInit(): void {
    this.prestamoId = Number(this.route.snapshot.paramMap.get('prestamoId'));
    if (this.prestamoId) {
      this.fetchPrestamoDetalle();
    }
  }

  fetchPrestamoDetalle(): void {
    if (this.prestamoId !== null) {
      this.prestamoService.getPrestamoDetalle(this.prestamoId).subscribe(
        (data) => {
          this.prestamo = data;
          console.log('Detalles del préstamo:', this.prestamo);
          console.log('Estructura del objeto recibido:', data);
          if (this.prestamo && Array.isArray(this.prestamo)) {
            this.prestamo = {
              cronograma: this.prestamo
            };
          }
        },
        (error) => {
          console.error('Error fetching prestamo detalle', error);
        }
      );
    }
  }

  logFechas() {
    const hoy = new Date();
    const fechaVencimiento = new Date(this.prestamo.fechaVencimiento);
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

  getPagoClass(pago: any): string {
    const hoy = this.clearTime(new Date());
    const fechaVencimiento = this.clearTime(new Date(pago.fechaVencimiento));
    const fechaVencimientoAdjusted = new Date(fechaVencimiento);
    fechaVencimientoAdjusted.setDate(fechaVencimiento.getDate() + 1);

    const inicioSemanaActual = new Date(hoy);
    inicioSemanaActual.setDate(hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1)); // Lunes de esta semana
    const finSemanaActual = new Date(inicioSemanaActual);
    finSemanaActual.setDate(inicioSemanaActual.getDate() + 6); // Domingo de esta semana

    if (pago.estado === 'PAGADO') {
      return 'pago-pagado';
    } else if (fechaVencimientoAdjusted < hoy) {
      return 'pago-vencido';
    } else if (fechaVencimientoAdjusted >= inicioSemanaActual && fechaVencimientoAdjusted <= finSemanaActual) {
      return 'pago-vencen-semana';
    } else {
      return 'pago-por-vencer';
    }
  }

  marcarComoPagada(numero: number): void {
    if (this.prestamoId !== null) {
      console.log(`Marcando como pagada la cuota ${numero} del préstamo ${this.prestamoId}`);
      this.prestamoService.marcarCuotaComoPagada(this.prestamoId, numero).subscribe(
        (response) => {
          console.log('Pago marcado como pagado exitosamente', response);
          this.fetchPrestamoDetalle(); // Refrescar la lista de pagos
        },
        (error) => {
          console.error('Error marcando el pago como pagado', error);
        }
      );
    }
  }
}
