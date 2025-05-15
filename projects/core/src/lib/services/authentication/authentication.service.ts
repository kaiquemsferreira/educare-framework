import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthCredentialsModel } from '../../models/authentication/auth-credentials.model';
import { DecodedTokenModel } from '../../models/authentication/decoded-token.model';
import { TranslateService } from '@ngx-translate/core';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly TOKEN_KEY = 'token';

  constructor(private readonly translateService: TranslateService) { }

  public saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getCredentials(): AuthCredentialsModel | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decodedToken = this.decodeToken(token);

      if (!this.isTokenValid(decodedToken)) {
        this.clearCredentials();
        return null;
      }

      return {
        email: decodedToken.email,
        fullName: decodedToken.fullName,
        token: token
      };
    } catch (error) {
      this.clearCredentials();
      throw error;
    }
  }

  private decodeToken(token: string): DecodedTokenModel {
    return jwtDecode<DecodedTokenModel>(token);
  }

  private isTokenValid(decodedToken: DecodedTokenModel): boolean {
    return decodedToken.exp * 1000 > Date.now();
  }

  public clearCredentials(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public async handleError(error: HttpErrorResponse, message: string): Promise<string> {
    const translationKey = message;

    try {
      const translatedMessage = await firstValueFrom(
        this.translateService.get(translationKey)
      );

      return translationKey === message
        ? `${translatedMessage}: ${error.message}`
        : translatedMessage;
    } catch (error) {
      this.clearCredentials();
      throw error;
    }
  }
}
