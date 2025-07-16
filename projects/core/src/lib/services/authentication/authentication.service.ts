import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthCredentialsModel } from '../../models/authentication/auth-credentials.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private readonly http: HttpClient) {}

  public getCurrentUser(): Observable<AuthCredentialsModel> {
    return this.http.get<AuthCredentialsModel>('/auth/me', {
      withCredentials: true
    });
  }

  public logout(): Observable<void> {
    return this.http.post<void>('/auth/logout', {}, {
      withCredentials: true
    });
  }
}
