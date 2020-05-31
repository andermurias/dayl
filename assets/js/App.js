import React from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {colors} from "./Common/Colors";
import DateTasks from "./Template/DateTasks";
import Login from "./Template/Login";
import Footer from "./Component/Footer";
import {DoneTaskProvider} from "./_context/DoneTaskContext";
import {PendingTaskProvider} from "./_context/PendingTaskContext";
import {AppProvider} from "./_context/AppContext";
import ModalLoader from "./Component/ModalLoader";

const isAuthenticated = () => localStorage.getItem('token');

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
    }
  },
  overrides: {
//    MuiListItem: {
//      "&$selected": {
//        color: colors.orangePeel,
//      },
//    },
  },
  palette: {
    text: {
      primary: colors.richBlack
    },
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
      secure: true
    },
  },
  {
    route: "/",
    component: () => <Redirect to={{pathname: '/tasks'}}/>,
    props: {
      secure: true
    }
  },
];

const Contextureize = ({children}) => {
  return [
    AppProvider,
    DoneTaskProvider,
    PendingTaskProvider,
  ].reverse()
    .reduce(
      (content, Context) => <Context>{content}</Context>,
      children
    );
}

export default function App(props) {
  return (
    <AppProvider>
      <DoneTaskProvider>
        <PendingTaskProvider>
          <MuiThemeProvider theme={theme}>
            <Router>
              <Switch>
                {routerConfiguration.map((route, i) => {
                  return (
                    <Route path={route.route} key={i} render={(props) => checkRouteAuthorized(route, props)}/>
                  );
                })}
              </Switch>
              <ModalLoader/>
              <Footer/>
            </Router>
          </MuiThemeProvider>
        </PendingTaskProvider>
      </DoneTaskProvider>
    </AppProvider>
  );
}
