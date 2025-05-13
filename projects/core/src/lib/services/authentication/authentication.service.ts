import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

import { AuthCredentialsModel } from '../../models/authentication/auth-credentials.model';
import { DecodedTokenModel } from '../../models/authentication/decoded-token.model';
import { ConstantMessagesEnum } from '../../enums/constant-messages.enum';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly TOKEN_KEY = 'token';

  constructor(private readonly translateService: TranslateService) {}

  public saveToken(token: string): void | null {
    if (typeof window === 'undefined') return null;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getCredentials(): AuthCredentialsModel {
    if (typeof window === 'undefined') {
      throw new Error('getCredentials() should not be called on the server');
    }

    const token = this.requireToken();
    const decoded = this.decodeAndValidateToken(token);

    return this.buildAuthCredentials(token, decoded);
  }

  private requireToken(): string {
    const token = this.getToken();
    if (!token) {
      throw new Error(ConstantMessagesEnum.TOKEN_IS_NOT_SET);
    }
    return token;
  }

  private decodeAndValidateToken(token: string): DecodedTokenModel {
    let decoded: DecodedTokenModel;
    try {
      decoded = this.decodeToken(token);
    } catch (error) {
      this.clearCredentials();
      throw new Error(ConstantMessagesEnum.TOKEN_MALFORMED + (error as Error).message);
    }

    if (!this.isTokenValid(decoded)) {
      this.clearCredentials();
      throw new Error(ConstantMessagesEnum.TOKEN_IS_EXPIRED);
    }

    return decoded;
  }

  private buildAuthCredentials(token: string, decoded: DecodedTokenModel): AuthCredentialsModel {
    return {
      email: decoded.email,
      fullname: decoded.fullName,
      token
    };
  }

  private decodeToken(token: string): DecodedTokenModel {
    if (!token) {
      throw new Error('Invalid token: must be a non-empty string');
    }

    const jwtDecode: (token: string) => unknown = require('jwt-decode');

    const decoded = jwtDecode(token);
    if (!decoded || typeof decoded !== 'object' || !('email' in decoded) || !('exp' in decoded)) {
      throw new Error('Invalid decoded token structure');
    }

    return decoded as DecodedTokenModel;
  }

  private isTokenValid(decodedToken: DecodedTokenModel): boolean {
    return decodedToken.exp * 1000 > Date.now();
  }

  public clearCredentials(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public async handleError(error: HttpErrorResponse): Promise<string> {
    const translationKey = this.getTranslationKeyForError(error.status);

    try {
      const translated = await firstValueFrom(this.translateService.get(translationKey));
      return translationKey === 'NOTIFICATIONS.ERROR.ERROR'
        ? `${translated}: ${error.message}`
        : translated;
    } catch (e) {
      console.error('Translation fetch failed', e);
      return ConstantMessagesEnum.UNEXPECTED_ERROR_OCCURRED + error.message;
    }
  }

  private getTranslationKeyForError(status: number): string {
    switch (status) {
      case 401:
        return 'NOTIFICATIONS.ERROR.INVALID_CREDENTIALS';
      case 404:
      case 500:
        return 'NOTIFICATIONS.ERROR.USER_NOT_FOUND';
      default:
        return 'NOTIFICATIONS.ERROR.ERROR';
    }
  }
}
