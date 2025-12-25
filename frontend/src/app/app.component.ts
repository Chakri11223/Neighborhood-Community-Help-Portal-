import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Neighborhood Help';

  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

  onSwitchRole() {
    const user = this.authService.currentUserValue;
    if (!user) return;

    const newRole = user.role === 'Resident' ? 'Helper' : 'Resident';

    if (confirm(`Switch to ${newRole} view?`)) {
      this.authService.switchRole(newRole).subscribe({
        error: (err) => alert('Failed: ' + err.message)
      });
    }
  }
}
