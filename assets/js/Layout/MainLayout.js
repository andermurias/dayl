import React, {useContext} from 'react';
import classNames from 'classnames';
import {useHistory} from 'react-router-dom';

import {makeStyles, useTheme} from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Fab from '@mui/material/Fab';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Hidden from '@mui/material/Hidden';

import MenuIcon from '@mui/icons-material/Menu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';

import Footer from '../Component/Footer/Footer';
import DrawerComponent from '../Component/Drawer/Drawer';
import {AppContext} from '../_context/AppContext';
import CalendarEvents, {drawerWidth} from '../Component/CalendarEvents/CalendarEvents';
import Empty from '../Component/Empty/Empty';
import {useUserApi} from '../_hook/useUserApi';
import {colors} from '../Common/Colors.js';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    borderTop: 'solid 1px ' + colors.orangePeel,
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
  const history = useHistory();
  const {token, setLoading, setOpenDrawer, openCalendarEvents, setOpenCalendarEvents} = useContext(AppContext);

  const {refreshTokenAndSave} = useUserApi();

  const rToken = localStorage.getItem('refreshToken');

  const isMediumOrDown = useMediaQuery(theme.breakpoints.down('lg'));

  const goToSearch = () => history.push('/search');
  const openCalendarEventsDrawer = () => setOpenCalendarEvents(true);

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
            <BottomNavigation className={classes.bottomNav}>
              <BottomNavigationAction icon={<MenuIcon />} onClick={setOpenDrawer} />
              <BottomNavigationAction icon={<SearchIcon />} onClick={goToSearch} />
              <BottomNavigationAction icon={<CalendarTodayIcon />} onClick={openCalendarEventsDrawer} />
            </BottomNavigation>
          </Hidden>
        </main>
        <CalendarEvents />
      </div>
    );
  } else {
    setLoading(true);
    refreshTokenAndSave(rToken).then(() => setLoading(false));
    return <Empty />;
  }
};

export default React.memo(MainLayout);
