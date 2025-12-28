import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-help-request',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './help-request.component.html',
  styleUrl: './help-request.component.scss'
})
export class HelpRequestComponent {
  requestForm: FormGroup;
  categories = ['Household', 'Medical', 'Transport', 'Social', 'Other'];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.requestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      attachments: [''] // Optional
    });
  }

  onSubmit() {
    if (this.requestForm.valid) {
      this.loading = true;
      this.requestService.createRequest(this.requestForm.value).subscribe({
        next: () => {
          this.snackBar.open('Request created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/requests']);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(err.error?.error || 'Failed to create request', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getCategoryIcon(category: string): string {
    const icons: any = {
      'Household': 'home',
      'Medical': 'local_hospital',
      'Transport': 'directions_car',
      'Social': 'groups',
      'Other': 'help'
    };
    return icons[category] || 'help';
  }
}
