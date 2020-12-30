import { Box, TextField, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState } from 'react';
import { ApiService } from '../api/ApiService';
import { SettlementAddress } from '../api/types';
import { getLocale } from '../locale';
import { LANG_UA } from '../consts';
import { Lang } from '../types';

const getOptionText = (option: SettlementAddress) => {
  const region = option.Region.length ? `, ${option.Region} ${option.RegionTypesCode}` : '';
  return (
    <Box>
      <Typography>
        {option.SettlementTypeCode}
        {' '}
        {option.MainDescription}
        <br />
      </Typography>
      <Typography variant="caption">
        {option.Area}
        {' '}
        {option.ParentRegionCode}
        {region}
        <br />
      </Typography>
    </Box>
  );
};

export type CitySelectInputProps = {
  apiKey?: string,
  apiUrl?: string,
  lang?: Lang,
  className?: string,
  showDefaults?: boolean,
  loadingSpinDelay?: number,
  onChange?: (address: SettlementAddress | null) => void,
  onError?: (error: Error) => void
};

type CitySelectProps = Required<Omit<CitySelectInputProps, 'apiKey' | 'apiUrl'>> & {
  apiKey?: string,
  apiUrl?: string,
};

const defaultProps: CitySelectProps = {
  className: '',
  showDefaults: true,
  loadingSpinDelay: 500,
  lang: LANG_UA,
  onChange: () => {},
  onError: () => {},
};

export function CitySelect(inputProps: CitySelectInputProps) {
  const [{ config, apiService, LOCALE }] = useState(() => {
    const mergedConfig: CitySelectProps = {
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
    showDefaults, loadingSpinDelay, className, onChange, onError,
  } = config;
  const [options, setOptions] = React.useState<SettlementAddress[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [queryString, setQueryString] = React.useState<string>('');

  React.useEffect(() => {
    if (queryString.length === 0 && !showDefaults) {
      setOptions([]);
      return;
    }

    const timeOut = setTimeout(() => {
      setLoading(true);
    }, loadingSpinDelay);

    let resolveAbort: () => void;
    const abortPromise = new Promise<void>((resolve) => {
      resolveAbort = resolve;
    });

    Promise.race([
      apiService.searchSettlements(queryString),
      abortPromise,
    ]).then((response) => {
      if (response) {
        setOptions(response);
      }
      clearTimeout(timeOut);
      setLoading(false);
    }).catch((error) => {
      clearTimeout(timeOut);
      setLoading(false);
      onError(error);
    });

    // eslint-disable-next-line consistent-return
    return () => resolveAbort && resolveAbort();
  }, [queryString]);

  React.useEffect(() => {}, [loading]);

  return (
    <Autocomplete
      id="npw-city"
      fullWidth
      className={className}
      options={options}
      loading={loading}
      openOnFocus
      onChange={(event: any, newValue: SettlementAddress | null) => {
        onChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setQueryString(newInputValue);
      }}
      loadingText={LOCALE.LOADING_LABEL}
      noOptionsText={queryString ? LOCALE.NOT_FOUND : LOCALE.ENTER_LOCALITY}
      getOptionSelected={(option, value) => option.Ref === value.Ref}
      getOptionLabel={(option) => option.Present}
      renderOption={getOptionText}
      renderInput={(params) => (
        <TextField
          {...params}
          label={LOCALE.CITY_LABEL}
          variant="outlined"
          InputProps={{
            name: 'np-city',
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
