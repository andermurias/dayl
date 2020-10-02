import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';

import {theme} from './_config/theme';
import {getForcedTheme} from './Common/Helper';

import AuthorizedComponent from './_hoc/AuthorizedComponent';

import Login from './Template/Login';
import DateTasks from './Template/DateTasks';

import ModalLoader from './Component/ModalLoader';
import SearchTasks from './Template/SearchTasks';

const routerConfiguration = [
  {
    route: '/login',
    component: Login,
    props: {
      isLogin: true,
    },
  },
  {
    route: '/tasks/:date',
    component: DateTasks,
    props: {
      secure: true,
    },
  },
  {
    route: '/tasks',
    component: DateTasks,
    props: {
      secure: true,
    },
  },
  {
    route: '/search',
    component: SearchTasks,
    props: {
      secure: true,
    },
  },
];

const RoutedApp = () => {
  const forceTheme = getForcedTheme();

  const prefersDarkMode = forceTheme ? forceTheme === 'dark' : useMediaQuery('(prefers-color-scheme: dark)');

  const muiTheme = createMuiTheme(theme(prefersDarkMode));

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Switch>
          {routerConfiguration.map((route, i) => {
            return (
              <Route path={route.route} key={i}>
                <AuthorizedComponent component={route.component} route={route} />
              </Route>
            );
          })}
        </Switch>
        <ModalLoader />
      </Router>
    </MuiThemeProvider>
  );
};

export default React.memo(RoutedApp);
