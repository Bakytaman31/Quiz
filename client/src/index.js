import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import './i18n';
import CircularProgress from '@mui/material/CircularProgress'

import './index.scss';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                <CircularProgress size={200} />
              </div>}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    </Suspense>
  </>,
);
