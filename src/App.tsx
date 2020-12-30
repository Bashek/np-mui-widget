import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// eslint-disable-next-line import/no-extraneous-dependencies
import ErrorIcon from '@material-ui/icons/Error';
import {
  Badge, Box, Container, Grid, Typography,
} from '@material-ui/core';
import { NPWidget, OnChangeEvent } from './components/NPWidget';
import './App.css';

function App() {
  const [state, setState] = useState<OnChangeEvent | null>(null);
  return (
    <div className="App">
      <Typography variant="h6" gutterBottom>
        Nova Poshta address select example
      </Typography>
      <Container component="main" maxWidth="lg">
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh', minWidth: 300 }}
        >
          <Grid item lg={8} xs={12}>
            <form action="#">
              <NPWidget
                onChange={(value) => setState(value)}
              />
            </form>
          </Grid>
          {state && (
          <Grid item lg={8} xs={12} style={{ padding: 30 }}>
            <Badge badgeContent={state.fulfilled ? <CheckCircleIcon color="primary" /> : <ErrorIcon />}>
              <Box style={{ textAlign: 'left', width: '100%' }}>
                { state.city && <Typography variant="caption">Місто: {state.city.MainDescription}</Typography>}
                <br />
                { state.point && <Typography variant="caption">{state.point.Description}</Typography>}
              </Box>
            </Badge>
          </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
