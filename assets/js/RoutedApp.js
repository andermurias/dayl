import React from 'react';
import {adaptV4Theme} from '@mui/material/styles';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider, StyledEngineProvider} from '@mui/material';

import { createTheme } from '@mui/material/styles';

import {theme} from './_config/theme';
import {checkAndUpdateTheme, getForcedTheme, getSavedTheme, THEME_DARK} from './Common/Helper';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import AuthorizedComponent from './_hoc/AuthorizedComponent';

import Login from './Template/Login';
import DateTasks from './Template/DateTasks';
import Calendar from './Template/Calendar';

import ModalLoader from './Component/ModalLoader/ModalLoader';
import SearchTasks from './Template/SearchTasks';
import MainLayout from './Layout/MainLayout';
import Dashboard from "./Template/Dashboard";
import { useTranslation } from 'react-i18next';

const routerConfiguration = [
  {
    route: '/dashboard',
    component: Dashboard,
  },
  {
    route: '/tasks/:date?',
    component: DateTasks,
  },
  {
    route: '/calendar/:date?',
    component: Calendar,
  },
  {
    route: '/search',
    component: SearchTasks,
  },
];

const RoutedApp = () => {
  checkAndUpdateTheme();
  const forceTheme = getSavedTheme();

  const prefersDarkMode = forceTheme ? forceTheme === THEME_DARK : useMediaQuery('(prefers-color-scheme: dark)');

  const muiTheme = createTheme(theme(prefersDarkMode));

  const {i18n} = useTranslation();

  window.__localeId__ = i18n.language;

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline/>
          <Router>
            <Switch>
              <Route path="/login" exact>
                <Login/>
              </Route>
              <Route>
                <AuthorizedComponent>
                  <MainLayout>
                    <Switch>
                      {routerConfiguration.map((route, j) => (
                        <Route path={route.route} key={j}>
                          <route.component route={route}/>
                        </Route>
                      ))}
                    </Switch>
                  </MainLayout>
                </AuthorizedComponent>
              </Route>
            </Switch>
            <ModalLoader/>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default React.memo(RoutedApp);
