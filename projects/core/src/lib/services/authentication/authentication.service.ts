import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthCredentialsModel } from '../../models/authentication/auth-credentials.model';
import { catchError, firstValueFrom, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private readonly http: HttpClient) {}

  public getCurrentUser(): Observable<AuthCredentialsModel> {
    return this.http.get<AuthCredentialsModel>('/auth/me', {
      withCredentials: true
    });
  }

  public async isAuthenticated(): Promise<boolean> {
    return await firstValueFrom(
      this.getCurrentUser().pipe(
        catchError(() => of(null))
      )
    ).then(user => !!user);
  }

  public logout(): Observable<void> {
    return this.http.post<void>('/auth/logout', {}, {
      withCredentials: true
    });
  }
}
