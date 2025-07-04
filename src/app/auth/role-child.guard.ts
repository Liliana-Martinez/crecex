import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { AccessService } from '../core/services/access.service';

export const roleChildGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot) => {
  const aunthService = inject(AuthService);
  const router = inject(Router);
  const accessService = inject(AccessService);

  const expectedRoles: string[] = childRoute.data['expectedRoles'];
  const userType = aunthService.getUserType();

  if (!expectedRoles.includes(userType)) {
    accessService.showAccesDeniedModal();
    router.navigate(['/app/home']);
    return false;
  }
  return true;
};
