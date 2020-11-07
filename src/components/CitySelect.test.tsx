import React from 'react';
import fetch from 'jest-fetch-mock';
import { render, act, waitFor } from '@testing-library/react';
import { CitySelect, CitySelectProps } from './CitySelect';
import { createConfig } from '../createConfig';
import { ApiService } from '../api/ApiService';
import { SearchSettlementResponseMock } from '../api/__moks__/SearchSettlementResponseMock';
import { LocaleContext } from './LocaleContext';
import { LOCALE_UA } from '../locale';

const LOADER_TIMEOUT = 50;
describe('<CitySelect/>', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const appConfig = createConfig({
    showLoadingSpinAfter: LOADER_TIMEOUT,
  });
  const apiService = new ApiService(appConfig, (error) => {
    throw error;
  });

  function renderCitySelect(props: Partial<CitySelectProps> = {}) {
    const defaultProps: CitySelectProps = {
      onChange: () => undefined,
      appConfig,
      apiService,
      ...props,
    };

    return render(
      <LocaleContext.Provider value={LOCALE_UA}>
        <CitySelect {...defaultProps} />
      </LocaleContext.Provider>,
    );
  }

  test('Loading should shown wile data loading', async () => {
    jest.useFakeTimers();
    fetch.mockResponse(async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(JSON.stringify(SearchSettlementResponseMock));
        }, LOADER_TIMEOUT * 4);
      });
    });

    const { getByRole } = renderCitySelect();

    act(() => {
      jest.advanceTimersByTime(LOADER_TIMEOUT + 5);
    });

    const loading = getByRole('progressbar');
    expect(loading).toBeVisible();
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => expect(loading).not.toBeInTheDocument());
  });
});
