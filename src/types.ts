export type AppConfig = {
  apiKey: string,
  searchCityLimit: number,
  apiUrl: string,
  showDefaultCities: boolean,
  showLoadingSpinAfter: number,
  lang: string
};

export type InitialAppConfig = Partial<AppConfig>;
