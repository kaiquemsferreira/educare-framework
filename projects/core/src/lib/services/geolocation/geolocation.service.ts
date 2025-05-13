import { Injectable } from '@angular/core';

import { GeolocationDataModel } from '../../models/geolocation/geolocation-data.model';
import { ConstantMessagesEnum } from '../../enums/constant-messages.enum';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiService } from '../api/api.service';

const API_URL = 'http://ip-api.com/json/?fields=status,message,country,countryCode,regionName,city,timezone,query';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private readonly apiRest: ApiService) {}

  public getGeolocation(): Observable<GeolocationDataModel> {
    return this.apiRest.getExternal(API_URL).pipe(
      map((data: any) => ({
        latitude: data.lat,
        longitude: data.lon,
        countryCode: data.countryCode,
      })),
      catchError(error => {
        const customError = {
          message: ConstantMessagesEnum.FAILED_TO_FETCH_GEOLOCATION,
          timestamp: Date.now(),
          originalError: error,
        };
        return throwError(() => customError);
      })
    );
  }
}
