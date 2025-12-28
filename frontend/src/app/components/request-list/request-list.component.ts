import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RequestService, HelpRequest } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { Observable, map } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent implements OnInit {
  requests: HelpRequest[] = [];
  loading = true;
  userRole: string = '';
  userId: number = 0;

  constructor(
    private requestService: RequestService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const user = this.authService.currentUserValue;
    if (user) {
      this.userRole = user.role;
      this.userId = user.id;
      this.loadRequests();
    }
  }

  loadRequests() {
    this.loading = true;
    let obs: Observable<{ requests: HelpRequest[] }>;

    if (this.userRole === 'Resident') {
      obs = this.requestService.getMyRequests();
    } else {
      // Helper sees all. By default showing all.
      // Could filter by 'Pending' to show available tasks first
      obs = this.requestService.getAllRequests();
    }

    obs.subscribe({
      next: (res) => {
        this.requests = res.requests;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load requests', err);
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending': return 'warn';
      case 'Accepted': return 'accent';
      case 'In-progress': return 'primary';
      case 'Completed': return 'primary'; // or custom green
      default: return '';
    }
  }

  canAccept(req: HelpRequest): boolean {
    return this.userRole === 'Helper' && req.status === 'Pending';
  }

  onDelete(req: HelpRequest) {
    if (confirm('Are you sure you want to delete this request?')) {
      this.requestService.deleteRequest(req.id).subscribe({
        next: () => {
          // Remove from list
          this.requests = this.requests.filter(r => r.id !== req.id);
        },
        error: (err) => {
          alert('Failed to delete: ' + (err.error?.error || 'Unknown error'));
        }
      });
    }
  }

  getCategoryIcon(category: string): string {
    const icons: any = {
      'Household': 'home',
      'Tech Support': 'computer',
      'Transport': 'directions_car',
      'Education': 'school',
      'Emergency': 'warning'
    };
    return icons[category] || 'help';
  }

  getCategoryColor(category: string): string {
    const x = category.length;
    if (x % 3 === 0) return 'blue';
    if (x % 3 === 1) return 'purple';
    return 'orange';
  }
}
