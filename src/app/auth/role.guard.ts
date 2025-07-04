import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['expectedRoles'];
  const userType = authService.getUserType(); //Obtiene 'usuario1', 'usuario2', etc.

  if (!expectedRoles.includes(userType)) {
    router.navigate(['/no autorizado']);
    return false;
  }
  return true;
};
