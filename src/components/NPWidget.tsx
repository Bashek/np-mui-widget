import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';

import { PointSelect } from './PointSelect';
import { CitySelect } from './CitySelect';
import { NPPoint, SettlementAddress } from '../api/types';
import { Lang } from '../types';
import { LANG_UA } from '../consts';

export type OnChangeEvent = {
  fulfilled: boolean,
  city: SettlementAddress | null,
  point: NPPoint | null
};

export type WPWidgetInputProps = {
  onChange: (event: OnChangeEvent) => void,
  onError?: (error: Error) => void,
  lang?: Lang,
  apiKey?: string,
  apiUrl?: string,
  showDefaults?: boolean,
  pointClassName?: string,
  cityClassName?: string,
  loadingSpinDelay?: number
};

type WPWidgetProps = Required<Omit<WPWidgetInputProps, 'apiKey' | 'apiUrl' | 'onChange'>>;
const defaultProps: WPWidgetProps = {
  onError: (error: Error) => {
    console.log(error);
  },
  lang: LANG_UA,
  showDefaults: true,
  pointClassName: '',
  cityClassName: '',
  loadingSpinDelay: 500,
};

export function NPWidget(props: WPWidgetInputProps) {
  const [config] = useState(() => {
    return {
      ...defaultProps,
      ...props,
    };
  });
  const {
    onChange, onError, lang, apiKey, apiUrl, pointClassName,
    cityClassName, loadingSpinDelay, showDefaults,
  } = config;
  const [city, setCity] = useState<SettlementAddress | null>(null);
  const [point, setPoint] = useState<NPPoint | null>(null);
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CitySelect
          onChange={(value) => {
            setCity(value);
          }}
          className={cityClassName}
          lang={lang}
          apiUrl={apiUrl}
          apiKey={apiKey}
          loadingSpinDelay={loadingSpinDelay}
          showDefaults={showDefaults}
          onError={onError}
        />
      </Grid>
      <Grid item xs={12}>
        <PointSelect
          city={city}
          className={pointClassName}
          lang={lang}
          apiUrl={apiUrl}
          apiKey={apiKey}
          loadingSpinDelay={loadingSpinDelay}
          onError={onError}
          onChange={(nextPoint) => setPoint(nextPoint)}
        />
      </Grid>
    </Grid>
  );
}
