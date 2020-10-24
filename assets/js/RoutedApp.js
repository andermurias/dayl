import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';

import {theme} from './_config/theme';
import {checkAndUpdateTheme, getForcedTheme, getSavedTheme, THEME_DARK} from './Common/Helper';

import AuthorizedComponent from './_hoc/AuthorizedComponent';

import Login from './Template/Login';
import DateTasks from './Template/DateTasks';
import Calendar from './Template/Calendar';

import ModalLoader from './Component/ModalLoader/ModalLoader';
import SearchTasks from './Template/SearchTasks';
import MainLayout from './Layout/MainLayout';

const routerConfiguration = [
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

  const muiTheme = createMuiTheme(theme(prefersDarkMode));

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>
          <Route>
            <AuthorizedComponent>
              <MainLayout>
                <Switch>
                  {routerConfiguration.map((route, j) => (
                    <Route path={route.route} key={j}>
                      <route.component route={route} />
                    </Route>
                  ))}
                </Switch>
              </MainLayout>
            </AuthorizedComponent>
          </Route>
        </Switch>
        <ModalLoader />
      </Router>
    </MuiThemeProvider>
  );
};

export default React.memo(RoutedApp);
