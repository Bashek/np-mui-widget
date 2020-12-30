import React from 'react';
import fetch from 'jest-fetch-mock';
import {
  render, act, waitFor, fireEvent,
} from '@testing-library/react';
import { CitySelect, CitySelectInputProps } from '../CitySelect';
import { SearchSettlementResponseMock } from '../../api/__mocks__/SearchSettlementResponseMock';
import { LOCALE_UA } from '../../locale';

const LOADER_TIMEOUT = 500;
describe('<CitySelect/>', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  function renderCitySelect(props: Partial<CitySelectInputProps> = {}) {
    const defaultProps: CitySelectInputProps = {
      onChange: () => undefined,
      ...props,
    };

    return render(
      <CitySelect {...defaultProps} />,
    );
  }

  test('Loading should be shown wile data loading', async () => {
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
