import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

import { GeolocationLanguageModel, getGeolocationTranslation } from '../../models/geolocation/geolocation-language.model';
import { GeolocationDataModel } from '../../models/geolocation/geolocation-data.model';
import { GeolocationService } from '../geolocation/geolocation.service';
import { NotificationService } from '../notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(
    private readonly translateService: TranslateService,
    private readonly geolocationService: GeolocationService,
    private readonly titleService: Title,
    private readonly notificationService: NotificationService
  ) {}

  public addLangs(): void {
    this.translateService.addLangs(['de-DE', 'en-US', 'es-ES', 'fr-FR', 'pt-BR', 'ru-RU', 'zh-CN']);
  }

  public initializeLanguage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const cachedLang: string | null = localStorage.getItem('userLang');
      if (cachedLang == null) {
        this.setLanguageByGeolocation().then(() => {});
      } else {
        this.translateService.use(cachedLang);
      }
    } else {
      this.translateService.use(GeolocationLanguageModel.ENGLISH.toString());
    }
  }

  public async setLanguageByGeolocation(): Promise<void> {
    this.geolocationService.getGeolocation().subscribe({
      next: (data: GeolocationDataModel) => {
        const userLang = getGeolocationTranslation(data.countryCode);
        this.translateService.use(userLang);
        localStorage.setItem('userLang', userLang);
      },
      error: (error: any) => {
        this.translateService.use(GeolocationLanguageModel.ENGLISH.toString());
        localStorage.setItem('userLang', GeolocationLanguageModel.ENGLISH.toString());
        throw new Error('Error determining location: ' + error.message);
      }
    });
  }

  public defineTitle(key: string): void {
    this.translateService.get(key).subscribe((translatedTitle: string) => {
      this.titleService.setTitle(translatedTitle);
    });
  }

  public translateNotificationSuccess(translationKey: string, message?: string): void {
    this.translateService.get(translationKey).subscribe(translation => {
      const fullMessage = message ? `${translation} ${message}` : translation;
      this.notificationService.success(fullMessage);
    });
  }

  public translateNotificationWarning(translationKey: string): void {
    this.translateService.get(translationKey).subscribe(translation => {
      this.notificationService.warning(translation);
    });
  }

  public translateNotificationError(translationKey: string, errorMessage?: string): void {
    this.translateService.get(translationKey).subscribe(translation => {
      const fullMessage = errorMessage ? `${translation} ${errorMessage}` : translation;
      this.notificationService.error(fullMessage);
    });
  }
}
