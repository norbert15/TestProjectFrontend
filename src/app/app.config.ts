import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { IconsRegisterService } from './services/icon-register.service';
import { AuthService } from './services/http/auth.service';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export function initializeIcons(iconService: IconsRegisterService): () => void {
  return () => {
    iconService.registerCustomIcons();
  };
}

export function initAuth(authService: AuthService) {
  return () =>
    authService.setAccessToken(authService.accessTokenFromStorage ?? '');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeIcons,
      multi: true,
      deps: [IconsRegisterService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      multi: true,
      deps: [AuthService],
    },
  ],
};
