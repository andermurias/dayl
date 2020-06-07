import React, {Suspense} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, useParams} from 'react-router-dom';

import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {colors} from './Common/Colors';
import DateTasks from './Template/DateTasks';
import Login from './Template/Login';
import Footer from './Component/Footer';
import {DoneTaskProvider} from './_context/DoneTaskContext';
import {PendingTaskProvider} from './_context/PendingTaskContext';
import {AppProvider} from './_context/AppContext';
import ModalLoader from './Component/ModalLoader';
import {getForcedTheme, isAuthenticated} from './Common/Helper';

const checkRouteAuthorized = (route, props) => {
  if (route.props.secure && !isAuthenticated()) {
    return <Redirect to={{pathname: '/login'}} />;
  }

  if (route.props.isLogin && isAuthenticated()) {
    return <Redirect to={{pathname: '/tasks'}} />;
  }

  return <route.component {...props} {...route.props} />;
};

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
    route: '/',
    component: () => <Redirect to={{pathname: '/tasks'}} />,
    props: {
      secure: true,
    },
  },
];

const Contextureize = ({children}) => {
  return [AppProvider, DoneTaskProvider, PendingTaskProvider]
    .reverse()
    .reduce((content, Context) => <Context>{content}</Context>, children);
};

export default function App(props) {
  const forceTheme = getForcedTheme();

  const prefersDarkMode = forceTheme ? forceTheme === 'dark' : useMediaQuery('(prefers-color-scheme: dark)');

  const theme = createMuiTheme({
    typography: {
      h1: {
        fontFamily: '"Montserrat"',
      },
      h2: {
        fontFamily: '"Lato"',
      },
      h3: {
        fontFamily: '"Montserrat"',
      },
      h4: {
        fontFamily: '"Montserrat"',
      },
      h5: {
        fontFamily: '"Montserrat"',
      },
      h6: {
        fontFamily: '"Montserrat"',
      },
      overline: {
        fontFamily: '"Montserrat"',
      },
    },
    overrides: {
      MuiInputBase: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #424242 inset!important',
            WebkitTextFillColor: '#fff',
          },
        },
      },
    },
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
      text: {
        primary: prefersDarkMode ? colors.babyPowder : colors.richBlack,
      },
      primary: {
        main: prefersDarkMode ? colors.babyPowder : colors.richBlack,
      },
      secondary: {
        main: colors.orangePeel,
      },
    },
  });

  return (
    <Suspense fallback="loading">
      <Contextureize>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Switch>
              {routerConfiguration.map((route, i) => {
                return <Route path={route.route} key={i} render={(props) => checkRouteAuthorized(route, props)} />;
              })}
            </Switch>
            <ModalLoader />
            <Footer />
          </Router>
        </MuiThemeProvider>
      </Contextureize>
    </Suspense>
  );
}
