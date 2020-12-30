import fetch from 'jest-fetch-mock';
import { ApiService } from '../ApiService';
import { SearchSettlementResponseMock } from '../__mocks__/SearchSettlementResponseMock';
import { SearchPointResponseMock } from '../__mocks__/SearchPointResponseMock';
import { SettlementAddress } from '../types';

const createService = () => {
  return new ApiService();
};

const getFirstMockedAddress = (): SettlementAddress => {
  // @ts-ignore
  return SearchSettlementResponseMock.data[0].Addresses[0] as SettlementAddress;
};

describe('ApiService', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('Should return array of SettlementAddress', async () => {
    fetch.once(JSON.stringify(SearchSettlementResponseMock));
    const service = createService();
    const result = await service.searchSettlements('');

    // @ts-ignore
    expect(result).toEqual(SearchSettlementResponseMock.data[0].Addresses);
  });

  it('Should return array of SettlementAddress', async () => {
    fetch.once(JSON.stringify(SearchPointResponseMock));
    // @ts-ignore
    const settlement = getFirstMockedAddress();
    const service = createService();
    const result = await service.getPoints(settlement);

    expect(result).toEqual(SearchPointResponseMock.data);
  });

  it('should catch error parsing JSON', async () => {
    fetch.once('');
    try {
      const service = createService();
      await service.searchSettlements('');
    } catch (error) {
      expect(error.message).toContain('JSON');
    }
  });

  it('should catch error with bad HTTP response', async () => {
    fetch.once(() => (Promise.resolve({
      body: 'Not Found',
      init: {
        status: 400,
      },
    })));
    const service = createService();
    try {
      await service.searchSettlements('');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain('400');
    }
  });

  it('should catch error from API', async () => {
    const errorCodes = [100, 200];
    fetch.once(JSON.stringify({
      errorCodes,
    }));
    // @ts-ignore
    try {
      const service = createService();
      await service.searchSettlements('');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain(errorCodes.join(', '));
    }
  });

  it('should cache requests', async () => {
    fetch.mockResponse(JSON.stringify(SearchPointResponseMock));
    const service = createService();
    await service.searchSettlements('test');
    await service.searchSettlements('test');
    const settlement = getFirstMockedAddress();
    await service.getPoints(settlement);
    await service.getPoints(settlement);

    expect(fetch.mock.calls.length).toBe(2);
  });
});
