import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { AccessService } from '../core/services/access.service';


/**Guard para proteger kas rutas individuales, es decir, que no tienen rutas hijas */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const accessService = inject(AccessService);

  const expectedRoles: string[] = route.data['expectedRoles'];
  const userType = authService.getUserType(); //Obtiene 'usuario1', 'usuario2', etc.

  if (!expectedRoles.includes(userType)) {
    accessService.showAccesDeniedModal();
    router.navigate(['/app/home']);
    return false;
  }
  return true;
};
