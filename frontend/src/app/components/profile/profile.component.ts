import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onSwitchRole() {
    if (!this.user) return;

    const newRole = this.user.role === 'Resident' ? 'Helper' : 'Resident';

    // Optional: Add confirmation dialog here
    if (confirm(`Are you sure you want to switch your role to ${newRole}?`)) {
      this.authService.switchRole(newRole).subscribe({
        next: (res) => {
          // User is automatically updated via behavior subject
          // Could show snackbar here
        },
        error: (err) => {
          alert('Failed to switch role: ' + (err.error?.error || 'Unknown error'));
        }
      });
    }
  }
}
