import { API_CALLED_METHOD, API_MODEL_NAME } from './const';
import {
  NPPoint,
  SettlementAddress,
  SearchPointResponse,
  SearchSettlementResponse, ApiResponse, ApiRequest,
} from './types';
import { ErrorHandlerInterface } from '../errors/errorHandler';
import { AppConfig } from '../types';

export class ApiService {
  private searchSettlementCache = new Map<string, SettlementAddress[]>();

  private searchNPPointCache = new Map<SettlementAddress['Ref'], NPPoint[]>();

  constructor(
    private appConfig: AppConfig,
    private errorHandler: ErrorHandlerInterface,
  ) {}

  async searchSettlements(query: string): Promise<SettlementAddress[]> {
    if (!this.searchSettlementCache.has(query)) {
      try {
        const result = await this.makeRequest<SearchSettlementResponse>({
          apiKey: this.appConfig.apiKey,
          modelName: API_MODEL_NAME.ADDRESS,
          calledMethod: API_CALLED_METHOD.SEARCH_SETTLEMENT,
          methodProperties: {
            CityName: query,
            Limit: 5,
          },
        });

        if (result.data.length === 0) {
          this.searchSettlementCache.set(query, []);
        } else {
          this.searchSettlementCache.set(query, result.data[0].Addresses);
        }
      } catch (e) {
        this.errorHandler(e);
        return Promise.resolve([]);
      }
    }

    return Promise.resolve(this.searchSettlementCache.get(query) as SettlementAddress[]);
  }

  async getPoints(npCity: SettlementAddress): Promise<NPPoint[]> {
    const cityRef = npCity.Ref;
    if (!this.searchNPPointCache.has(cityRef)) {
      try {
        const result = await this.makeRequest<SearchPointResponse>({
          apiKey: this.appConfig.apiKey,
          modelName: API_MODEL_NAME.ADDRESS_GENERAL,
          calledMethod: API_CALLED_METHOD.GET_WAREHOUSE,
          methodProperties: {
            CityRef: npCity.DeliveryCity,
          },
        });
        this.searchNPPointCache.set(cityRef, result.data);
      } catch (e) {
        this.errorHandler(e);
        return Promise.resolve([]);
      }
    }

    return Promise.resolve(this.searchNPPointCache.get(cityRef) as NPPoint[]);
  }

  private makeRequest<T extends ApiResponse>(properties: ApiRequest): Promise<T> {
    let body;

    try {
      body = JSON.stringify(properties);
    } catch (error) {
      return Promise.reject(error);
    }

    return fetch(this.appConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(
        new Error(
          `Can not make request ${properties.calledMethod}. Status ${response.statusText}, code ${response.status}`,
        ),
      );
    }).then((data) => {
      if (data.errorCodes.length) {
        const error = new Error(`Search settlement request failed. Error codes: ${data.errorCodes.join(', ')}`);
        return Promise.reject(error);
      }

      return data;
    });
  }
}
