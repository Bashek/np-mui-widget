import { LANG_RU, LANG_UA } from './consts';

export type Lang = typeof LANG_RU | typeof LANG_UA;

export type AppConfig = {
  apiKey: string,
  apiUrl: string,
  lang: Lang
};
