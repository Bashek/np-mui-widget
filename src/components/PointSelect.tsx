import { CircularProgress, TextField, Typography } from '@material-ui/core';
import React, {
  useEffect, useRef, useState,
} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SettlementAddress, NPPoint } from '../api/types';
import { LANG_UA } from '../consts';
import { Lang } from '../types';
import { ApiService } from '../api/ApiService';
import { getLocale } from '../locale';

export type PointSelectInputProps = {
  className?: string,
  city?: SettlementAddress | null,
  onChange?: (point: NPPoint | null) => void,
  onError?: (error: Error) => void,
  lang?: Lang,
  loadingSpinDelay?: number,
  apiKey?: string,
  apiUrl?: string
};

type PointSelectProps = Required<Omit<PointSelectInputProps, 'apiKey' | 'apiUrl' | 'city'>> & {
  apiKey?: string,
  apiUrl?: string,
};

const defaultProps: PointSelectProps = {
  className: '',
  loadingSpinDelay: 500,
  lang: LANG_UA,
  onChange: () => {},
  onError: () => {},
};

export function PointSelect(inputProps: PointSelectInputProps) {
  const [{ config, apiService, LOCALE }] = useState(() => {
    const mergedConfig: PointSelectProps = {
      ...defaultProps,
      ...inputProps,
    };
    return {
      apiService: new ApiService(mergedConfig.apiUrl, mergedConfig.apiKey),
      config: mergedConfig,
      LOCALE: getLocale(mergedConfig.lang),
    };
  });
  const {
    loadingSpinDelay, onChange, className, onError,
  } = config;
  const { city } = inputProps;
  const [points, setPoints] = useState<NPPoint[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<NPPoint | null>(null);
  const refInput = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (city) {
      let resolveAbort: () => void;
      setValue(null);
      setPoints([]);
      const timeOut = setTimeout(() => setLoading(true), loadingSpinDelay);

      Promise.race([
        apiService.getPoints(city),
        new Promise<void>((resolve) => {
          resolveAbort = resolve;
        }),
      ]).then((nextPoints) => {
        clearTimeout(timeOut);
        setLoading(false);
        if (nextPoints) {
          setPoints(nextPoints);
          if (refInput.current !== null) {
            refInput.current.focus();
          }
        }
      }).catch((error) => {
        clearTimeout(timeOut);
        setLoading(false);
        onError(error);
      });

      return () => resolveAbort && resolveAbort();
    }
    setPoints([]);
    setValue(null);
    onChange(null);
  }, [city]);

  return (
    <Autocomplete
      id="npw-point"
      fullWidth
      className={className}
      disabled={!points.length}
      options={points}
      loading={!loading}
      loadingText={LOCALE.LOADING_LABEL}
      openOnFocus
      value={value}
      onChange={(event: any, nextValue: NPPoint | null) => {
        setValue(nextValue);
        onChange(nextValue);
      }}
      getOptionSelected={(option, currentValue) => option.Ref === currentValue.Ref}
      getOptionLabel={(option) => option.Description}
      renderOption={(option) => <Typography variant="body2">{option.Description}</Typography>}
      renderInput={(params) => (
        <TextField
          {...params}
          label={LOCALE.POINT_LABEL}
          variant="outlined"
          inputRef={refInput}
          InputProps={{
            name: 'np-point',
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
