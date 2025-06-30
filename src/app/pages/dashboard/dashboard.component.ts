import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiciosService } from '../../service/deudas/servicios.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'dashboard-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-filtros sticky-filtros">
      <select [(ngModel)]="selectedMonth" (change)="monthChange.emit(selectedMonth)">
        <option *ngFor="let m of months" [value]="m.value">{{ m.name }}</option>
      </select>
      <select [(ngModel)]="selectedEstado" (change)="estadoChange.emit(selectedEstado)">
        <option value="">Todo</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="PAGADO">Pagado</option>
        <option value="VENCIDO">Vencido</option>
      </select>
    </div>
  `,
  styles: [
    `.dashboard-filtros { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding: 0 24px; background: #f4f8fa; border-radius: 0 0 24px 24px; box-shadow: 0 2px 8px #0001; }`,
    `.sticky-filtros { position: sticky; top: 0; z-index: 10; }`,
    `select { font-size: 1.1rem; border-radius: 16px; padding: 8px 24px; border: none; background: #2e4632; color: #fff; font-weight: 600; margin-right: 16px; min-width: 160px; }`
  ]
})
export class DashboardFiltrosComponent {
  @Input() months: any[] = [];
  @Input() selectedMonth: string = '';
  @Input() selectedEstado: string = '';
  @Output() monthChange = new EventEmitter<string>();
  @Output() estadoChange = new EventEmitter<string>();
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  deudas: any[] = [];
  deudasFiltradas: any[] = [];
  months = [
    { name: 'Enero', value: '01' }, { name: 'Febrero', value: '02' }, { name: 'Marzo', value: '03' },
    { name: 'Abril', value: '04' }, { name: 'Mayo', value: '05' }, { name: 'Junio', value: '06' },
    { name: 'Julio', value: '07' }, { name: 'Agosto', value: '08' }, { name: 'Septiembre', value: '09' },
    { name: 'Octubre', value: '10' }, { name: 'Noviembre', value: '11' }, { name: 'Diciembre', value: '12' }
  ];
  selectedMonth: string = '';
  selectedEstado: string = '';

  constructor(private serviciosService: ServiciosService, private router: Router) { }

  ngOnInit() {
    this.selectedMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    this.obtenerDeudas();
  }

  obtenerDeudas() {
    const year = new Date().getFullYear();
    const mes = `${year}-${this.selectedMonth}`;
    this.serviciosService.getServiciosByFecha(mes).subscribe({
      next: (deudas) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        console.log('Fecha de hoy:', hoy.toDateString(), 'Timestamp:', hoy.getTime());

        this.deudas = deudas.map((d: any) => {
          if (d.estado === 'PENDIENTE') {
            // Parsear la fecha de forma explícita para evitar problemas de zona horaria
            const fechaVencStr = d.fechaVencimiento; // '2025-06-22'
            const [año, mes, dia] = fechaVencStr.split('-').map(Number);
            const fechaVenc = new Date(año, mes - 1, dia); // mes - 1 porque Date usa 0-11 para meses
            fechaVenc.setHours(0, 0, 0, 0);

            // Debug: mostrar las fechas que se están comparando
            console.log(`Deuda ${d.nombre || 'sin nombre'}:`, {
              fechaVencOriginal: d.fechaVencimiento,
              fechaVencParsed: fechaVenc.toDateString(),
              timestampVenc: fechaVenc.getTime(),
              timestampHoy: hoy.getTime(),
              diferencia: fechaVenc.getTime() - hoy.getTime(),
              esVencida: fechaVenc.getTime() < hoy.getTime()
            });

            // Alternativa: Comparación por partes de fecha (más explícita)
            const añoVenc = fechaVenc.getFullYear();
            const mesVenc = fechaVenc.getMonth();
            const diaVenc = fechaVenc.getDate();

            const añoHoy = hoy.getFullYear();
            const mesHoy = hoy.getMonth();
            const diaHoy = hoy.getDate();

            const vencida = (añoVenc < añoHoy) ||
              (añoVenc === añoHoy && mesVenc < mesHoy) ||
              (añoVenc === añoHoy && mesVenc === mesHoy && diaVenc < diaHoy);

            if (vencida) {
              return { ...d, estadoVisual: 'VENCIDO' };
            }
            return { ...d, estadoVisual: 'PENDIENTE' };
          }
          return { ...d, estadoVisual: 'PAGADO' };
        });
        this.filtrarEstado();
      },
      error: () => {
        this.deudas = [];
        this.filtrarEstado();
      }
    });
  }

  onMonthChangeFromFiltro(mes: string) {
    this.selectedMonth = mes;
    this.obtenerDeudas();
  }

  onEstadoChangeFromFiltro(estado: string) {
    this.selectedEstado = estado;
    this.filtrarEstado();
  }

  filtrarEstado() {
    this.deudasFiltradas = this.deudas.filter(d => {
      const matchEstado = this.selectedEstado ? d.estadoVisual === this.selectedEstado : true;
      return matchEstado;
    });
  }

  editarDeuda(deuda: any) {
    this.router.navigate(['/registrar'], { queryParams: { id: deuda.id } });
  }

  eliminarDeuda(deuda: any) {
    if (confirm('¿Seguro que deseas eliminar esta deuda?')) {
      this.serviciosService.eliminarDeuda(deuda.id).subscribe({
        next: () => {
          alert('¡Deuda eliminada exitosamente!');
          this.obtenerDeudas();
        },
        error: (err) => alert('Error al eliminar deuda')
      });
    }
  }

  marcarComoPagada(deuda: any) {
    if (confirm('¿Marcar esta deuda como pagada?')) {
      this.serviciosService.marcarComoPagada(deuda.id).subscribe({
        next: () => this.obtenerDeudas(),
        error: (err) => alert('Error al marcar como pagada')
      });
    }
  }
}