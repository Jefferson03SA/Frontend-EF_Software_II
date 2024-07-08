import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiciosService } from '../../service/deudas/servicios.service';

@Component({
  selector: 'app-crear-deuda',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-deuda.component.html',
  styleUrls: ['./crear-deuda.component.css']
})
export class CrearDeudaComponent {
  deudaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService,
    private router: Router
  ) {
    this.deudaForm = this.fb.group({
      numeroDocumento: ['', Validators.required],
      empresa: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0)]],
      fechaVencimiento: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.deudaForm.valid) {
      this.serviciosService.crearDeuda(this.deudaForm.value).subscribe({
        next: (response) => {
          console.log('Deuda agregada:', response);
          this.router.navigate(['/servicios']);
        },
        error: (error) => {
          console.error('Error al agregar deuda:', error);
        }
      });
    }
  }
}
