import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PrestamoService } from '../../service/prestamos/prestamo.service';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css'],
  providers: [PrestamoService]
})
export class PrestamosComponent implements OnInit {
  prestamos: any[] = [];

  constructor(
    private prestamoService: PrestamoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPrestamos();
  }

  fetchPrestamos(): void {
    this.prestamoService.getPrestamos().subscribe(
      (data) => {
        this.prestamos = data;
      },
      (error) => {
        console.error('Error fetching prestamos', error);
      }
    );
  }

  onPrestamoClick(prestamoId: number): void {
    // Redirige a una página de detalle del préstamo, si es necesario
    this.router.navigate([`/prestamos/${prestamoId}`]);
  }

  agregarPrestamo(): void {
    this.router.navigate(['/registrar-prestamo']);
  }
}
