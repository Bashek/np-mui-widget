import { API_CALLED_METHOD, API_MODEL_NAME } from './const';

export type SettlementAddress = {
  AddressDeliveryAllowed: boolean,
  Warehouses: number,
  MainDescription: string,
  Area: string,
  ParentRegionCode: string,
  ParentRegionTypes: string,
  RegionTypesCode: string,
  Region: string,
  SettlementTypeCode: string,
  Ref: string,
  DeliveryCity: string,
  StreetsAvailability: boolean,
  RegionTypes: string,
  Present: string, // Human readable description
};

export type NPPoint = {
  Description: string,
  DescriptionRu: string,
  Phone: string,
  TypeOfWarehouse: string,
  Ref: string,
  Number: string,
  CityRef: string,
  SiteKey: string,
  ShortAddress: string,
  ShortAddressRu: string,
  CityDescription: string,
  CityDescriptionRu: string,
  TotalMaxWeightAllowed: string,
  PlaceMaxWeightAllowed: string,
  [key: string]: unknown
};

export type SearchSettlementRequest = {
  apiKey: string,
  modelName: API_MODEL_NAME.ADDRESS,
  calledMethod: API_CALLED_METHOD.SEARCH_SETTLEMENT,
  methodProperties: {
    CityName: string,
    Limit: number
  }
};

export type SearchSettlementResponse = {
  success: boolean,
  data: [] | [{
    Addresses: SettlementAddress[],
    TotalCount: number
  }],
  info: unknown[],
  errors: unknown[],
  warnings: unknown[],
  messageCodes: unknown[],
  errorCodes: number[],
  warningCodes: number[],
  infoCodes: number[]
};

export type SearchPointResponse = {
  success: boolean,
  TotalCount: number,
  data: NPPoint[],
  errors: unknown[],
  warnings: unknown[],
  messageCodes: unknown[],
  errorCodes: number[],
  warningCodes: number[],
  infoCodes: number[],
  info: { totalCount: number }
};

export type SearchPointRequest = {
  apiKey: string,
  modelName: API_MODEL_NAME.ADDRESS_GENERAL,
  calledMethod: API_CALLED_METHOD.GET_WAREHOUSE,
  methodProperties: {
    CityName?: SettlementAddress['DeliveryCity'],
    CityRef?: SettlementAddress['Ref'],
    Page?: number,
    Limit?: number,
  }
};

export type ApiResponse = SearchSettlementResponse | SearchPointResponse;
export type ApiRequest = SearchPointRequest | SearchSettlementRequest;
