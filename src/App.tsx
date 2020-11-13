import React from 'react';
import './App.css';
import { Container, Grid, Typography } from '@material-ui/core';
import { NPWidget, OnChangeEvent } from './components/NPWidget';
import { InitialAppConfig } from './types';

function App() {
  const onChange = (values: OnChangeEvent) => {
    console.error(values);  // eslint-disable-line
  };

  const config: InitialAppConfig = {
    apiKey: '',
    lang: 'ua',
  };

  return (
    <div className="App">
      <Typography variant="h2" gutterBottom>
        Nova Poshta address select example
      </Typography>
      <Container component="main" maxWidth="lg">
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item lg={8} style={{ minWidth: 300 }}>
            <NPWidget onChange={onChange} config={config} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
