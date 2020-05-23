import React from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import {colors} from "./Common/Colors";
import DateTasks from "./Template/DateTasks";
import Login from "./Template/Login";

const isAuthenticated = () => localStorage.getItem('token');

const theme = createMuiTheme({
  overrides: {
    MuiListItem: {
      "&$selected": {
        color: colors.orangePeel,
      },
    },
  },
  palette: {
    primary: {
      main: colors.richBlack,
    },
    secondary: {
      main: colors.orangePeel,
    },
  },
});

const checkRouteAuthorized = (route, props) => !route.props.secure || isAuthenticated() ?
  <route.component {...props} {...route.props} /> :
  <Redirect to={{pathname: '/login'}}/>;

const routerConfiguration = [
  {
    route: "/login",
    component: Login,
    props: {
      date: true
    },
  },
  {
    route: "/tasks/:date",
    component: DateTasks,
    props: {
      secure: true
    }
  },
  {
    route: "/tasks",
    component: DateTasks,
    props: {
      secure: true,
      date: 'today'
    },
  },
  {
    route: "/",
    component: () => <Redirect to={{pathname: '/tasks'}} />,
    props: {
      secure: true
    }
  },
];

export default function App(props) {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          {routerConfiguration.map((route, i) => {
            return (
              <Route path={route.route} key={i} render={(props) => checkRouteAuthorized(route, props)}/>
            );
          })}
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}
