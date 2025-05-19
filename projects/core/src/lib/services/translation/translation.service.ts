import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

import { GeolocationLanguageModel, getGeolocationTranslation } from '../../models/geolocation/geolocation-language.model';
import { GeolocationDataModel } from '../../models/geolocation/geolocation-data.model';
import { NotificationService } from '../notification/notification.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { Translation, TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  constructor(private readonly notificationService: NotificationService,
              private readonly geolocationService: GeolocationService,
              private readonly translocoService: TranslocoService,
              private readonly titleService: Title) { }

  public initializeLanguage(): void {
    const cachedLang = localStorage.getItem('userLang');
    const lang = cachedLang ?? GeolocationLanguageModel.ENGLISH;

    this.translocoService.setActiveLang(lang);
    if (!cachedLang) {
      this.setLanguageByGeolocation();
    }
  }

  public setLanguageByGeolocation(): void {
    this.geolocationService.getGeolocation().subscribe({
      next: (data: GeolocationDataModel) => {
        const userLang = getGeolocationTranslation(data.countryCode);
        this.translocoService.setActiveLang(userLang);
        localStorage.setItem('userLang', userLang);
      },
      error: () => {
        this.translocoService.setActiveLang(GeolocationLanguageModel.ENGLISH);
        localStorage.setItem('userLang', GeolocationLanguageModel.ENGLISH);
      }
    });
  }

  public defineTitle(key: string, scope?: string): void {
    this.translocoService.selectTranslate(key, {}, scope).subscribe(title => {
      this.titleService.setTitle(title);
    });
  }

  public translateNotificationSuccess(key: string, message?: string): void {
    this.translocoService.selectTranslate(key).subscribe(translation => {
      this.notificationService.success(message ? `${translation} ${message}` : translation);
    });
  }

  public translateNotificationWarning(key: string): void {
    this.translocoService.selectTranslate(key).subscribe(translation => {
      this.notificationService.warning(translation);
    });
  }

  public translateNotificationError(key: string, errorMessage?: string): void {
    this.translocoService.selectTranslate(key).subscribe(translation => {
      this.notificationService.error(errorMessage ? `${translation} ${errorMessage}` : translation);
    });
  }

  public loadScope(scope: string): Observable<Translation> {
    return this.translocoService.load(scope);
  }
}
