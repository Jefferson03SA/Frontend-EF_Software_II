import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="presupuestos-container">
      <h2>Préstamos</h2>
      <p>Aquí podrás gestionar tus préstamos.</p>
    </div>
  `,
  styles: [`
    .presupuestos-container {
      background: #fff;
      border-radius: 32px;
      padding: 48px 32px;
      min-width: 400px;
      min-height: 300px;
      box-shadow: 0 2px 8px #0001;
      margin: 40px auto;
      text-align: center;
    }
    h2 {
      color: #2e4632;
      margin-bottom: 24px;
    }
  `]
})
export class PresupuestosComponent {}
