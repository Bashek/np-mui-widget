import { CircularProgress, TextField, Typography } from '@material-ui/core';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ApiService } from '../api/ApiService';
import { SettlementAddress, NPPoint } from '../api/types';
import { AppConfig } from '../types';
import { LocaleContext } from './LocaleContext';

export type PointSelectProps = {
  className: string,
  appConfig: AppConfig,
  apiService: ApiService,
  city: SettlementAddress | null,
  onChange: (point: NPPoint | null) => void
};

export function PointSelect({
  className, city, apiService, onChange, appConfig,
}: PointSelectProps) {
  const LOCALE = useContext(LocaleContext);
  const [points, setPoints] = useState<NPPoint[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<NPPoint | null>(null);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (city) {
      const timeOut = setTimeout(() => setLoading(true), appConfig.showLoadingSpinAfter);
      apiService.getPoints(city).then((nextPoints) => {
        clearTimeout(timeOut);
        setLoading(false);
        setPoints(nextPoints);
        if (refInput.current !== null) {
          refInput.current.focus();
        }
      });

      return;
    }
    setValue(null);
    setPoints([]);
  }, [city]);

  return (
    <Autocomplete
      id="npw-city"
      fullWidth
      className={className}
      disabled={!points.length}
      options={points}
      loading={!loading}
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
