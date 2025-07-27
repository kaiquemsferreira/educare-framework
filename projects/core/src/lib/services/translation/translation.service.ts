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

  public async initializeApp(): Promise<void> {
    const cachedLang = localStorage.getItem('userLang');
    const lang = cachedLang ?? GeolocationLanguageModel.ENGLISH;

    if (!cachedLang) {
      try {
        const data = await firstValueFrom(this.geolocationService.getGeolocation());
        const userLang = getGeolocationTranslation(data.countryCode);
        this.translocoService.setActiveLang(userLang);
        localStorage.setItem('userLang', userLang);
      } catch {
        this.translocoService.setActiveLang(GeolocationLanguageModel.ENGLISH);
        localStorage.setItem('userLang', GeolocationLanguageModel.ENGLISH);
      }
    } else {
      this.translocoService.setActiveLang(lang);
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
    const [title, message, linkText, closeButton] = await Promise.all([
      firstValueFrom(this.translocoService.selectTranslate(data.title, {}, data.scope)),
      data.message ? firstValueFrom(this.translocoService.selectTranslate(data.message, {}, data.scope)) : Promise.resolve(''),
      data.linkText ? firstValueFrom(this.translocoService.selectTranslate(data.linkText, {}, data.scope)) : Promise.resolve(''),
      data.closeButton ? firstValueFrom(this.translocoService.selectTranslate(data.closeButton, {}, data.scope)) : Promise.resolve('')
    ]);

    return { title, message, link: data.link, linkText, target: data.target ?? '_blank', closeButton, duration: data.duration ?? 5000};
  }


  public loadScope(scope: string): Observable<Translation> {
    return this.translocoService.load(scope);
  }
}
