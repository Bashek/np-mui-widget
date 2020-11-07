import { Box, TextField, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useContext } from 'react';
import { ApiService } from '../api/ApiService';
import { SettlementAddress } from '../api/types';
import { AppConfig } from '../types';
import { LocaleContext } from './LocaleContext';

export type CitySelectProps = {
  apiService: ApiService,
  appConfig: AppConfig,
  className?: string,
  onChange: (address: SettlementAddress | null) => void
};

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

export function CitySelect({
  appConfig, apiService, className, onChange,
}: CitySelectProps) {
  const LOCALE = useContext(LocaleContext);
  const [options, setOptions] = React.useState<SettlementAddress[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [queryString, setQueryString] = React.useState<string>('');

  React.useEffect(() => {
    if (queryString.length === 0 && !appConfig.showDefaultCities) {
      setOptions([]);
      return;
    }

    (async () => {
      const timeOut = setTimeout(() => {
        setLoading(true);
      }, appConfig.showLoadingSpinAfter);
      const response = await apiService.searchSettlements(queryString);

      clearTimeout(timeOut);
      setLoading(false);
      setOptions(response);
    })();
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
