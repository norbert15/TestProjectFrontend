import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/http/auth.service';
import { catchError } from 'rxjs';
import { PopupService } from '../../services/popup.service';
import { Router } from '@angular/router';
import { Paths } from '../constans/paths';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const popupService = inject(PopupService);
  const router = inject(Router);

  const token = authService.accessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        popupService.add({
          details: 'Lejárt a munkamenet, jelentkezzen be újra!',
          severity: 'warning',
        });
        authService.setAccessToken('');
        router.navigate([Paths.STUDENTS]);
        // Refresh token használata...
      }

      throw error;
    }),
  );
};
