export enum GeolocationLanguageModel {
  PORTUGUESE = 'pt-BR',
  ENGLISH    = 'en-US',
  SPANISH    = 'es-ES',
  FRENCH     = 'fr-FR',
  GERMAN     = 'de-DE',
  RUSSIAN    = 'ru-RU',
  CHINESE    = 'zh-CN'
}

export function getGeolocationTranslation(countryCode: string): GeolocationLanguageModel {
  switch (countryCode.toUpperCase()) {
    case 'BR': return GeolocationLanguageModel.PORTUGUESE;
    case 'US': return GeolocationLanguageModel.ENGLISH;
    case 'ES': return GeolocationLanguageModel.SPANISH;
    case 'FR': return GeolocationLanguageModel.FRENCH;
    case 'DE': return GeolocationLanguageModel.GERMAN;
    case 'RU': return GeolocationLanguageModel.RUSSIAN;
    case 'CN': return GeolocationLanguageModel.CHINESE;
    default:   return GeolocationLanguageModel.ENGLISH;
  }
}
