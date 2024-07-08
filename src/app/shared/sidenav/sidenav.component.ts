import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/authentication/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout', error);
      }
    });
  }
}
