import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _accessToken = signal<string | null>(null);

  /**
   * Auth base url-je
   */
  private readonly authBaseUrl = `${environment.apiUrl}/auth`;

  /**
   * Http client injectálása
   */
  private readonly httpClient = inject(HttpClient);

  public get accessToken(): Signal<string | null> {
    return this._accessToken.asReadonly();
  }

  public get accessTokenFromStorage(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  /**
   * Bejelentkezés
   *
   * @param {string} username felhasználónév
   * @param {string} password felhasználó jelszava
   * @returns JWT token
   */
  public login(
    username: string,
    password: string,
  ): Observable<{ accessToken: string }> {
    return this.httpClient.post<{ accessToken: string }>(
      `${this.authBaseUrl}/login`,
      { username, password },
    );
  }

  public setAccessToken(token: string): void {
    this._accessToken.set(token);
    sessionStorage.setItem('accessToken', token);
  }
}
