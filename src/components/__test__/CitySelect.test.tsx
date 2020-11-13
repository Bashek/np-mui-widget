import React from 'react';
import fetch from 'jest-fetch-mock';
import {
  render, act, waitFor, fireEvent,
} from '@testing-library/react';
import { CitySelect, CitySelectProps } from '../CitySelect';
import { createConfig } from '../../createConfig';
import { ApiService } from '../../api/ApiService';
import { SearchSettlementResponseMock } from '../../api/__mocks__/SearchSettlementResponseMock';
import { LocaleContext } from '../LocaleContext';
import { LOCALE_UA } from '../../locale';

const LOADER_TIMEOUT = 50;
describe('<CitySelect/>', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  function renderCitySelect(props: Partial<CitySelectProps> = {}) {
    const appConfig = createConfig({
      showLoadingSpinAfter: LOADER_TIMEOUT,
    });
    const apiService = new ApiService(appConfig, (error) => {
      throw error;
    });

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

  test('Should trigger onUpdate callback', async () => {
    jest.useFakeTimers();
    fetch.once(JSON.stringify(SearchSettlementResponseMock));
    const onChange = jest.fn();
    const { container, getAllByRole, getByText } = renderCitySelect({
      onChange,
    });
    const input = container.querySelector('[type="text"]');
    if (input) {
      fireEvent.focus(input);
    }

    act(() => {
      jest.runAllTimers();
    });

    const loading = getByText(LOCALE_UA.LOADING_LABEL);
    await waitFor(() => expect(loading).not.toBeInTheDocument());

    const options = getAllByRole('option');
    jest.runAllTimers();
    fireEvent.click(options[0]);

    expect(onChange.mock.calls.length).toEqual(1);
  });
});
