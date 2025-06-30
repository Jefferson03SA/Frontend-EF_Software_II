import { Routes } from '@angular/router';
import { RegistroComponent } from './auth/registro/registro.component';
import { LoginComponent } from './auth/login/login.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: 'register', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: SidenavComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'registrar', loadComponent: () => import('./pages/registrar/registrar.component').then(m => m.RegistrarComponent), canActivate: [AuthGuard] },
      { path: 'notificaciones', loadComponent: () => import('./pages/notificaciones/notificaciones.component').then(m => m.NotificacionesComponent), canActivate: [AuthGuard] },
      { path: 'ajustes', loadComponent: () => import('./pages/ajustes/ajustes.component').then(m => m.AjustesComponent), canActivate: [AuthGuard] },
    ]
  },
];
