import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_CONFIG, ApiConfig } from '../../config/api.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_CONFIG) private readonly config: ApiConfig
  ) {}

  public get(endpoint: string, params?: any): Observable<any> {
    return this.http.get<any>(`${this.config.baseUrl}/${endpoint}`, {
      params,
      withCredentials: true
    });
  }

  public post(endpoint: string, body?: any, params?: any): Observable<any> {
    return this.http.post<any>(`${this.config.baseUrl}/${endpoint}`, body, {
      params,
      withCredentials: true
    });
  }

  public put(endpoint: string, body?: any, params?: any): Observable<any> {
    return this.http.put<any>(`${this.config.baseUrl}/${endpoint}`, body, {
      params,
      withCredentials: true
    });
  }

  public delete(endpoint: string, params?: any): Observable<any> {
    return this.http.delete<any>(`${this.config.baseUrl}/${endpoint}`, {
      params,
      withCredentials: true
    });
  }

  public getExternal(fullUrl: string, params?: any): Observable<any> {
    return this.http.get<any>(fullUrl, {
      params,
      withCredentials: false
    });
  }
}
