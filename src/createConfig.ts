import { AppConfig, InitialAppConfig } from './types';
import { LANG_UA } from './consts';

export function createConfig(config: InitialAppConfig = {}): AppConfig {
  return {
    apiKey: '',
    apiUrl: 'https://api.novaposhta.ua/v2.0/json/',
    searchCityLimit: 5,
    showDefaultCities: true,
    showLoadingSpinAfter: 500,
    lang: LANG_UA,
    ...config,
  };
}
