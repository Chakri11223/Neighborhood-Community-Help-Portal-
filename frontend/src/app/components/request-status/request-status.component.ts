import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService, HelpRequest } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-request-status',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatDividerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './request-status.component.html',
  styleUrl: './request-status.component.scss'
})
export class RequestStatusComponent implements OnInit {
  request: HelpRequest | null = null;
  loading = true;
  userRole: string = '';
  userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const user = this.authService.currentUserValue;
    if (user) {
      this.userRole = user.role;
      this.userId = user.id;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRequest(parseInt(id));
    }
  }

  loadRequest(id: number) {
    this.loading = true;
    this.requestService.getRequestById(id).subscribe({
      next: (res) => {
        this.request = res.request;
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load request', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/requests']);
      }
    });
  }

  updateStatus(newStatus: string) {
    if (!this.request) return;

    this.requestService.updateRequestStatus(this.request.id, newStatus).subscribe({
      next: (res) => {
        this.request = res.request;
        this.snackBar.open(`Request updated to ${newStatus}`, 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.error?.error || 'Failed to update status', 'Close', { duration: 3000 });
      }
    });
  }

  get canAccept(): boolean {
    return this.userRole === 'Helper' &&
      this.request?.status === 'Pending' &&
      this.request?.resident_id !== this.userId;
  }

  get isOwnRequest(): boolean {
    return this.request?.resident_id === this.userId;
  }

  get canComplete(): boolean {
    return this.userRole === 'Helper' &&
      this.request?.status === 'In-progress' &&
      this.request?.helper_id === this.userId;
  }


  get nextActionLabel(): string {
    if (this.request?.status === 'Accepted') return 'Start Work';
    if (this.request?.status === 'In-progress') return 'Mark Completed';
    return '';
  }

  onNextAction() {
    if (this.request?.status === 'Accepted') {
      this.updateStatus('In-progress');
    } else if (this.request?.status === 'In-progress') {
      this.updateStatus('Completed');
    }
  }

  onAccept() {
    this.updateStatus('Accepted');
  }

  getCategoryIcon(category: string): string {
    const icons: any = {
      'Household': 'home',
      'Medical': 'local_hospital',
      'Transport': 'directions_car',
      'Social': 'groups',
      'Tech Support': 'computer',
      'Education': 'school',
      'Emergency': 'warning',
      'Other': 'help'
    };
    return icons[category] || 'help';
  }
}
