import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ServiciosService } from '../../service/deudas/servicios.service';
import { CommonModule } from '@angular/common';
import { ServicioCardComponent } from '../../shared/servicio-card/servicio-card.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ServicioCardComponent],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
  providers: [ServiciosService]
})
export class ServiciosComponent implements OnInit {
  selectedMonth: string = '';
  selectedYear: string = '';
  servicios: any[] = [];

  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];

  years: number[] = [];

  constructor(
    private serviciosService: ServiciosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeYears();
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // +1 porque getMonth() retorna 0-11
    const currentYear = currentDate.getFullYear().toString();

    this.route.queryParams.subscribe(params => {
      this.selectedMonth = params['mes'] ? params['mes'].split('-')[1] : currentMonth;
      this.selectedYear = params['mes'] ? params['mes'].split('-')[0] : currentYear;
      if (this.selectedMonth && this.selectedYear) {
        this.fetchServicios();
      }
    });
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      this.years.push(i);
    }
  }

  fetchServicios(): void {
    if (this.selectedMonth && this.selectedYear) {
      const mes = `${this.selectedYear}-${this.selectedMonth}`;
      this.router.navigate([], { queryParams: { mes: mes } });
      this.serviciosService.getServiciosByFecha(mes).subscribe(
        (data) => {
          this.servicios = data;
        },
        (error) => {
          console.error('Error fetching services', error);
        }
      );
    }
  }

  agregarDeuda(): void {
    this.router.navigate(['/crear-deuda']);
  }
}
