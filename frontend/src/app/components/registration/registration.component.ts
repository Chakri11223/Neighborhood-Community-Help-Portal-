import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { AnimatedBackgroundComponent } from '../animated-background/animated-background.component';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    AnimatedBackgroundComponent,
    TranslateModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  roles = ['Resident', 'Helper']; // Admin usually not self-registered in public apps, but requirements allowed it? Requirement: "Role selection (Resident / Helper)"
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      contact_info: ['', Validators.required],
      location: ['', Validators.required],
      role: ['Resident', Validators.required]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.loading = true;
      this.authService.register(this.registrationForm.value).subscribe({
        next: () => {
          this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(err.error?.error || 'Registration failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
