import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, FormsModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isEditing = false;
  editData: Partial<User> = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.editData = { ...user };
        // Wait for DOM
        setTimeout(() => this.initScrollReveal(), 100);
      }
    });
  }

  private initScrollReveal(): void {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const revealElements = document.querySelectorAll('.reveal-hidden');
    revealElements.forEach(el => observer.observe(el));
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.user) {
      this.editData = { ...this.user };
    }
  }

  onSave() {
    if (!this.user) return;
    
    this.authService.updateUser(this.user.id, this.editData).subscribe({
      next: (res) => {
        this.isEditing = false;
        // The service tap() already updates the subject/storage
      },
      error: (err) => {
        alert('Failed to update profile: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }

  onCancel() {
    this.isEditing = false;
    if (this.user) {
      this.editData = { ...this.user };
    }
  }

  onSwitchRole() {
    if (!this.user) return;
    const newRole = this.user.role === 'Resident' ? 'Helper' : 'Resident';
    if (confirm(`Switch to ${newRole} view?`)) {
      this.authService.switchRole(newRole).subscribe({
        error: (err) => alert('Failed to switch: ' + err.message)
      });
    }
  }
}
