import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServiciosService } from '../../service/deudas/servicios.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {
  deudaForm: FormGroup;
  errorMsg: string | null = null;
  opcionSeleccionada: 'ocr' | 'manual' | null = null;
  ocrResultado: any = null;
  videoElement: HTMLVideoElement | null = null;
  canvasElement: HTMLCanvasElement | null = null;
  stream: MediaStream | null = null;

  constructor(private fb: FormBuilder, private serviciosService: ServiciosService, private router: Router, private route: ActivatedRoute) {
    this.deudaForm = this.fb.group({
      numeroDocumento: ['', Validators.required],
      empresa: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0)]],
      fechaVencimiento: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.serviciosService.getDeudaById(params['id']).subscribe({
          next: (deuda) => this.deudaForm.patchValue(deuda)
        });
      }
    });
  }

  onSubmit() {
    this.errorMsg = null;
    if (this.deudaForm.valid) {
      const id = this.route.snapshot.queryParamMap.get('id');
      if (id) {
        // Limpiar payload: solo campos válidos y no nulos/vacíos
        const raw = this.deudaForm.value;
        const payload: any = {};
        for (const key of Object.keys(raw)) {
          if (raw[key] !== null && raw[key] !== undefined && raw[key] !== '') {
            payload[key] = raw[key];
          }
        }
        // No enviar id ni campos no editables
        delete payload.id;
        this.serviciosService.actualizarDeudaPatch(Number(id), payload).subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: (err) => {
            this.errorMsg = err?.error?.message || 'Error al actualizar deuda';
            console.error('Error al actualizar deuda (PATCH)', err);
          }
        });
      } else {
        this.serviciosService.crearDeuda(this.deudaForm.value).subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: (err) => {
            this.errorMsg = err?.error?.message || 'Error al registrar deuda';
            console.error('Error al registrar deuda', err);
          }
        });
      }
    }
  }

  onSeleccionarOpcion(opcion: 'ocr' | 'manual') {
    this.opcionSeleccionada = opcion;
    console.log('Opción seleccionada:', opcion);
    if (opcion === 'ocr') {
      setTimeout(() => this.iniciarCamara(), 100); // Esperar renderizado
    } else {
      this.detenerCamara();
    }
  }

  iniciarCamara() {
    this.videoElement = document.querySelector('#ocrVideo') as HTMLVideoElement;
    if (navigator.mediaDevices && this.videoElement) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.stream = stream;
          this.videoElement!.srcObject = stream;
          this.videoElement!.play();
        })
        .catch(err => {
          console.error('No se pudo acceder a la cámara', err);
        });
    }
  }

  detenerCamara() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  tomarFoto() {
    this.videoElement = document.querySelector('#ocrVideo') as HTMLVideoElement;
    this.canvasElement = document.createElement('canvas');
    if (this.videoElement && this.canvasElement) {
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasElement.height = this.videoElement.videoHeight;
      const ctx = this.canvasElement.getContext('2d');
      if (ctx) {
        ctx.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvasElement.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'captura.jpg', { type: 'image/jpeg' });
            this.serviciosService.procesarImagenOCR(file).subscribe({
              next: (resp) => {
                this.ocrResultado = resp;
                if (resp) {
                  this.deudaForm.patchValue({
                    numeroDocumento: resp.numeroDocumento || '',
                    empresa: resp.empresa || '',
                    monto: resp.monto || '',
                    fechaVencimiento: resp.fechaVencimiento || ''
                  });
                  this.opcionSeleccionada = 'manual';
                }
              },
              error: (err) => {
                this.ocrResultado = null;
                console.error('Error OCR:', err);
              }
            });
          }
        }, 'image/jpeg');
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.serviciosService.procesarImagenOCR(file).subscribe({
        next: (resp) => {
          this.ocrResultado = resp;
          // Rellenar el formulario si la respuesta tiene datos válidos
          if (resp) {
            this.deudaForm.patchValue({
              numeroDocumento: resp.numeroDocumento || '',
              empresa: resp.empresa || '',
              monto: resp.monto || '',
              fechaVencimiento: resp.fechaVencimiento || ''
            });
            // Cambiar a vista de formulario manual para que el usuario pueda editar/guardar
            this.opcionSeleccionada = 'manual';
          }
        },
        error: (err) => {
          this.ocrResultado = null;
          console.error('Error OCR:', err);
        }
      });
    }
  }

  ngOnDestroy() {
    this.detenerCamara();
  }
}