import React from 'react';
import { render,  } from '@testing-library/react';
import { CitySelect, CitySelectProps } from './CitySelect';
import { createConfig } from '../createConfig';
import { ApiService } from '../api/ApiService';

describe('<CitySelect/>', () => {
  const appConfig = createConfig();
  const apiService = new ApiService(appConfig, (error) => {
    throw error;
  });

  function renderCitySelect(props: Partial<CitySelectProps> = {}) {
    const defaultProps: CitySelectProps = {
      onChange: (address) => undefined,
      appConfig,
      apiService,
      ...props,
    };

    return render(<CitySelect {...defaultProps} />);
  }

  test('should display a blank login dropdown', async () => {
    const { findByTestId } = renderCitySelect();
    const loginForm = await findByTestId('login-form');

    expect(loginForm).toHaveFormValues({
      username: "",
      password: "",
      remember: true,
    });

  });
  it('Should trigger "onChange"', () => {
    const onUsernameChange = jest.fn();

  })
});
