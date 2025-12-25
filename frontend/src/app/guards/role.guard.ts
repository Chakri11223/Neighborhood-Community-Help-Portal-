import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string;

  if (authService.hasRole(requiredRole)) {
    return true;
  }

  // Redirect to requests or dashboard if unauthorized for this specific route
  // Or show a "Not Authorized" message/page. For now redirecting to requests.
  return router.createUrlTree(['/requests']);
};
