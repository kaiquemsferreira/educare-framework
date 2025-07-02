import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { AuthenticationService } from '../authentication/authentication.service';
import { API_CONFIG, ApiConfig } from '../../config/api.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_CONFIG) private readonly config: ApiConfig,
    private readonly authService: AuthenticationService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  public get(endpoint: string, params?: any): Observable<any> {
    return this.http.get<any>(`${this.config.baseUrl}/${endpoint}`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  public post(endpoint: string, body?: any, params?: any): Observable<any> {
    return this.http.post<any>(`${this.config.baseUrl}/${endpoint}`, body, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  public put(endpoint: string, body?: any, params?: any): Observable<any> {
    return this.http.put<any>(`${this.config.baseUrl}/${endpoint}`, body, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  public delete(endpoint: string, params?: any): Observable<any> {
    return this.http.delete<any>(`${this.config.baseUrl}/${endpoint}`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  public getExternal(fullUrl: string, params?: any): Observable<any> {
    return this.http.get<any>(fullUrl, {
      params,
      headers: this.getAuthHeaders()
    });
  }
}
