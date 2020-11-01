import React, { useEffect, useState } from 'react';
import { createStyles, Theme } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { ApiService } from '../api/ApiService';
import { PointSelect } from './PointSelect';
import { CitySelect } from './CitySelect';
import { createConfig } from '../createConfig';
import { NPPoint, SettlementAddress } from '../api/types';
import { errorHandler as defaultErrorHandler } from '../errors/errorHandler';
import { InitialAppConfig } from '../types';
import { LOCALE_UA, LOCALE_RU } from '../locale';
import { LANG_RU } from '../consts';
import { LocaleContext } from './LocaleContext';

const useStyles = makeStyles((theme: Theme) => createStyles({
  formControl: {
    marginBottom: theme.spacing(4),
    minWidth: '100%',
  },
}));

export type OnChangeEvent = {
  fulfilled: boolean,
  city: SettlementAddress | null,
  point: NPPoint | null
};

export type WPWidgetProps = {
  config?: InitialAppConfig,
  onChange?: (event: OnChangeEvent) => void,
  onError?: (error: Error) => void,
  locale?: Partial<typeof LOCALE_UA>
};

export function NPWidget({
  onChange, config: initialConfig, onError, locale: customLocale,
}: WPWidgetProps) {
  const classes = useStyles();
  const [city, setCity] = useState<SettlementAddress | null>(null);
  const [point, setPoint] = useState<NPPoint | null>(null);
  const errorHandler = onError || defaultErrorHandler;
  const [{ config, apiService, locale }] = useState(() => {
    const appConfig = createConfig(initialConfig);
    const appLocale = appConfig.lang === LANG_RU ? LOCALE_RU : LOCALE_UA;

    if (customLocale) {
      Object.assign(appLocale, customLocale);
    }

    return {
      config: appConfig,
      apiService: new ApiService(appConfig, errorHandler),
      locale: appLocale,
    };
  });

  useEffect(() => {
    if (onChange) {
      onChange({
        city,
        point,
        fulfilled: city !== null && point !== null,
      });
    }
  }, [city, point]);

  return (
    <>
      <LocaleContext.Provider value={locale}>
        <CitySelect
          apiService={apiService}
          appConfig={config}
          className={classes.formControl}
          onChange={(value) => setCity(value)}
        />
        <PointSelect
          city={city}
          className={classes.formControl}
          apiService={apiService}
          appConfig={config}
          onChange={(nextPoint) => setPoint(nextPoint)}
        />
      </LocaleContext.Provider>
    </>
  );
}
