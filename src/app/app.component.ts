import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './shared/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidenavComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'proyecto-gestion-deudas';
}
