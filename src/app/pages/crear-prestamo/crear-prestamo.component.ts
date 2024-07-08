import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PrestamoService } from '../../service/prestamos/prestamo.service';

@Component({
  selector: 'app-crear-prestamo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './crear-prestamo.component.html',
  styleUrls: ['./crear-prestamo.component.css'],
  providers: [PrestamoService]
})
export class CrearPrestamoComponent {
  prestamoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private prestamoService: PrestamoService,
    private router: Router
  ) {
    this.prestamoForm = this.fb.group({
      monto: ['', Validators.required],
      interes: ['', Validators.required],
      fechaDesembolso: ['', Validators.required],
      entidad: ['', Validators.required],
      plazo: ['', Validators.required] // Añadido campo plazo
    });
  }

  onSubmit() {
    if (this.prestamoForm.valid) {
      const formValues = this.prestamoForm.value;
      formValues.interes = (formValues.interes / 100).toFixed(4); // Convertir porcentaje a decimal con dos decimales

      this.prestamoService.crearPrestamo(formValues).subscribe(
        response => {
          console.log('Préstamo creado exitosamente', response);
          this.router.navigate(['/prestamos']);
        },
        error => {
          console.error('Error al crear el préstamo', error);
        }
      );
    }
  }
}
