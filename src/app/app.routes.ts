import { Routes } from '@angular/router';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { PrestamosComponent } from './pages/prestamos/prestamos.component';
import { CronogramaComponent } from './pages/cronograma/cronograma.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { LoginComponent } from './auth/login/login.component';
import { CrearDeudaComponent } from './pages/crear-deuda/crear-deuda.component';
import { CrearPrestamoComponent } from './pages/crear-prestamo/crear-prestamo.component';
import { PrestamoDetalleComponent } from './pages/prestamo-detalle/prestamo-detalle.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: 'register', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: 'servicios', component: ServiciosComponent, canActivate: [AuthGuard] },
      { path: 'crear-deuda', component: CrearDeudaComponent, canActivate: [AuthGuard] },
      { path: 'prestamos', component: PrestamosComponent, canActivate: [AuthGuard] },
      { path: 'cronograma', component: CronogramaComponent, canActivate: [AuthGuard] },
      { path: 'registrar-prestamo', component: CrearPrestamoComponent, canActivate: [AuthGuard] },
      { path: 'prestamos/:prestamoId', component: PrestamoDetalleComponent, canActivate: [AuthGuard] },
    ]
  },
];
