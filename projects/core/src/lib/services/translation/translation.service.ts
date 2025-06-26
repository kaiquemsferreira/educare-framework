import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

import { GeolocationLanguageModel, getGeolocationTranslation } from '../../models/geolocation/geolocation-language.model';
import { GeolocationDataModel } from '../../models/geolocation/geolocation-data.model';
import { NotificationService } from '../notification/notification.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { Translation, TranslocoService } from '@ngneat/transloco';
import { firstValueFrom, Observable } from 'rxjs';
import { NotificationDataModel } from '../../models/notification/notification-data.model';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  constructor(private readonly notificationService: NotificationService,
              private readonly geolocationService: GeolocationService,
              private readonly translocoService: TranslocoService,
              private readonly titleService: Title) { }

  public initializeLanguage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cachedLang = localStorage.getItem('userLang');
      const lang = cachedLang ?? GeolocationLanguageModel.ENGLISH;

      this.translocoService.setActiveLang(lang);
      if (!cachedLang) {
        this.setLanguageByGeolocation();
      }
    } else {
      this.translocoService.setActiveLang(GeolocationLanguageModel.ENGLISH);
    }
  }

  public setLanguageByGeolocation(): void {
    this.geolocationService.getGeolocation().subscribe({
      next: (data: GeolocationDataModel) => {
        const userLang = getGeolocationTranslation(data.countryCode);
        this.translocoService.setActiveLang(userLang);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('userLang', userLang);
        }
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

  public async translateNotificationSuccess(data: NotificationDataModel): Promise<void> {
    const translated = await this.buildNotificationData(data);
    this.notificationService.success(translated);
  }

  public async translateNotificationError(data: NotificationDataModel): Promise<void> {
    const translated = await this.buildNotificationData(data);
    this.notificationService.error(translated);
  }

  public async translateNotificationWarning(data: NotificationDataModel): Promise<void> {
    const translated = await this.buildNotificationData(data);
    this.notificationService.warning(translated);
  }

  public async translateNotificationInfo(data: NotificationDataModel): Promise<void> {
    const translated = await this.buildNotificationData(data);
    this.notificationService.info(translated);
  }

  private async buildNotificationData(data: NotificationDataModel): Promise<NotificationDataModel> {
    const [title, message, link, closeButton] = await Promise.all([
      firstValueFrom(this.translocoService.selectTranslate(data.title, {}, data.scope)),
      data.message ? firstValueFrom(this.translocoService.selectTranslate(data.message, {}, data.scope)) : Promise.resolve(''),
      data.link ? firstValueFrom(this.translocoService.selectTranslate(data.link, {}, data.scope)) : Promise.resolve(''),
      data.closeButton ? firstValueFrom(this.translocoService.selectTranslate(data.closeButton, {}, data.scope)) : Promise.resolve('')
    ]);

    return { title, message, link, closeButton, duration: data.duration};
  }


  public loadScope(scope: string): Observable<Translation> {
    return this.translocoService.load(scope);
  }
}
