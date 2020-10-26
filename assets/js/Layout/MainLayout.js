import React, {useContext} from 'react';
import classNames from 'classnames';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Hidden from '@material-ui/core/Hidden';

import MenuIcon from '@material-ui/icons/Menu';

import Footer from '../Component/Footer/Footer';
import DrawerComponent from '../Component/Drawer/Drawer';
import {AppContext} from '../_context/AppContext';
import CalendarEvents, {drawerWidth} from '../Component/CalendarEvents/CalendarEvents';
import Empty from '../Component/Empty/Empty';
import {useUserApi} from '../_hook/useUserApi';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    position: 'relative',
    flexDirection: 'column',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('lg')]: {
      marginRight: -drawerWidth,
    },
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  fab: {
    margin: theme.spacing(1),
    position: 'fixed',
    bottom: theme.spacing(1),
    left: theme.spacing(1),
    zIndex: 100,
  },
}));

const MainLayout = ({children}) => {
  const classes = useStyles();
  const theme = useTheme();
  const {token, setLoading, setOpenDrawer, openCalendarEvents} = useContext(AppContext);

  const {refreshTokenAndSave} = useUserApi();

  const rToken = localStorage.getItem('refreshToken');

  const isMediumOrDown = useMediaQuery(theme.breakpoints.down('md'));

  if (token !== null) {
    return (
      <div className={classes.root}>
        <div>
          <DrawerComponent />
        </div>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: openCalendarEvents && !isMediumOrDown,
          })}
        >
          {children}
          <Footer />
          <Hidden mdUp>
            <Fab size="medium" color="secondary" aria-label="menu" className={classes.fab} onClick={setOpenDrawer}>
              <MenuIcon />
            </Fab>
          </Hidden>
        </main>
        <>
          <CalendarEvents />
        </>
      </div>
    );
  } else {
    setLoading(true);
    refreshTokenAndSave(rToken).then(() => setLoading(false));
    return <Empty />;
  }
};

export default React.memo(MainLayout);
