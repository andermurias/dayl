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
import Calendar from './Template/Calendar';

import ModalLoader from './Component/ModalLoader/ModalLoader';
import SearchTasks from './Template/SearchTasks';
import MainLayout from './Layout/MainLayout';

const routerConfiguration = [
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
    route: '/calendar/:date',
    component: Calendar,
    props: {
      secure: true,
    },
  },
  {
    route: '/calendar',
    component: Calendar,
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
          <Route path="/login" exact>
            <AuthorizedComponent
              component={Login}
              route={{
                props: {
                  isLogin: true,
                },
              }}
            />
          </Route>
          <Route>
            <MainLayout>
              <Switch>
                {routerConfiguration.map((route, j) => (
                  <Route path={route.route} key={j}>
                    <AuthorizedComponent component={route.component} route={route} />
                  </Route>
                ))}
              </Switch>
            </MainLayout>
          </Route>
        </Switch>
        <ModalLoader />
      </Router>
    </MuiThemeProvider>
  );
};

export default React.memo(RoutedApp);
