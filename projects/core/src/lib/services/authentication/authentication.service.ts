import { Injectable } from '@angular/core';

import { AuthCredentialsModel } from '../../models/authentication/auth-credentials.model';
import { DecodedTokenModel } from '../../models/authentication/decoded-token.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly TOKEN_KEY = 'token';

  constructor() { }

  public saveToken(token: string): void {
    if (token.trim() !== '') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return typeof token === 'string' ? token : null;
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
}
