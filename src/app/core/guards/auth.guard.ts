import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/http/auth.service';
import { Paths } from '../constans/paths';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  const token = authService.accessTokenFromStorage;

  if (token) {
    authService.setAccessToken(token);
    return true;
  }

  const router = inject(Router);

  return router.navigate([Paths.STUDENTS]);
};
