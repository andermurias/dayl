import React, {useContext} from 'react';

import {useTranslation} from 'react-i18next';

import useTheme from '@material-ui/core/styles/useTheme';
import {makeStyles} from '@material-ui/core/styles';

import MuiDrawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import SearchIcon from '@material-ui/icons/Search';
import GitHubIcon from '@material-ui/icons/GitHub';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import TodayIcon from '@material-ui/icons/Today';
import CodeIcon from '@material-ui/icons/Code';
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import EventNoteIcon from '@material-ui/icons/EventNote';

import {colors} from '../../Common/Colors';

import {logout, THEME_DARK, THEME_LIGHT} from '../../Common/Helper';
import {AppContext} from '../../_context/AppContext';

import Link from '../../Atom/Link';
import DrawerItem from '../DrawerItem/DrawerItem';

import logoDark from '../../../static/img/logo/dayl_logo_full_dark.svg';
import logo from '../../../static/img/logo/dayl_logo_full.svg';
import {isDarkTheme} from '../../_config/theme';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    justifyContent: 'space-between',
  },
  toolbar: {
    padding: theme.spacing(4, 2, 1, 2),
  },
  content: {
    flexGrow: 1,
    backgroundColor: colors.mineShaft,
    padding: theme.spacing(3),
    position: 'relative',
    flexDirection: 'column',
  },
  fab: {
    margin: theme.spacing(1),
    position: 'fixed',
    bottom: theme.spacing(1),
    left: theme.spacing(1),
  },
  logo: {
    width: '66%',
  },
  topList: {},
  bottomList: {
    paddingBottom: theme.spacing(2),
  },
}));

const generateMenuItem = ({text, icon, url, type, subtext, checked, action}) => ({
  text: text,
  subtext: subtext || null,
  Icon: icon,
  url: url || '#',
  type: type || 'item',
  checked: checked || false,
  action: action || (() => {}),
});
const generateMenuHeader = ({text}) => generateMenuItem({text: text, type: 'header'});

const generateMenuDivider = () => generateMenuItem({type: 'divider'});

const generateMenuSwitch = ({text, icon, action, checked}) =>
  generateMenuItem({text: text, icon: icon, type: 'switch', checked: checked, action: action});

const Drawer = () => {
  const classes = useStyles();
  const {t} = useTranslation();
  const theme = useTheme();
  const {currentDate, openDrawer, setCloseDrawer, openCalendarEvents, setOpenCalendarEvents} = useContext(AppContext);

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('sm'));

  const mainMenu = [
    generateMenuItem({
      icon: TodayIcon,
      text: t('menu.today'),
      url: '/tasks',
    }),
    generateMenuHeader({
      text: t('menu.header.tasks'),
    }),
    generateMenuItem({
      icon: FormatListNumberedIcon,
      text: t('menu.tasks'),
      url: '/tasks/' + currentDate,
    }),
    generateMenuItem({
      icon: CalendarTodayIcon,
      text: t('menu.calendar'),
      url: '/calendar',
    }),
    generateMenuItem({
      icon: SearchIcon,
      text: t('menu.search'),
      url: '/search',
    }),
    generateMenuHeader({
      text: t('menu.header.calendar'),
    }),
    generateMenuItem({
      text: t('menu.calendarevents'),
      icon: EventNoteIcon,
      action: () => {
        setOpenCalendarEvents(!openCalendarEvents);
      },
    }),
    generateMenuHeader({
      text: t('menu.header.more'),
    }),
    generateMenuItem({
      text: t('menu.theme'),
      icon: isDarkTheme(theme) ? Brightness2Icon : BrightnessHighIcon,
      action: () => {
        location.href =
          location.origin + location.pathname + '?theme=' + (isDarkTheme(theme) ? THEME_LIGHT : THEME_DARK);
      },
    }),
    generateMenuItem({
      icon: ExitToAppIcon,
      text: t('menu.exit'),
      action: logout,
    }),
  ];
  const secondaryMenu = [
    generateMenuHeader({
      text: t('menu.header.about'),
    }),
    generateMenuItem({
      icon: GitHubIcon,
      text: t('menu.github'),
      url: 'https://github.com/andermurias/dayl',
    }),
    generateMenuItem({
      icon: CodeIcon,
      text: '@andermurias',
      url: 'https://andermurias.me',
    }),
  ];

  return (
    <MuiDrawer
      className={classes.drawer}
      variant={isSmlOrDown ? 'temporary' : 'permanent'}
      open={openDrawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
      ModalProps={{
        onBackdropClick: setCloseDrawer,
      }}
    >
      <div className={classes.topList}>
        <div className={classes.toolbar}>
          <Link className={classes.logoContainer} to="/tasks">
            <img src={theme.palette.type === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo} />
          </Link>
        </div>
        <List dense>
          {mainMenu.map((item, i) => (
            <DrawerItem item={item} key={i} />
          ))}
        </List>
      </div>
      <div className={classes.bottomList}>
        {secondaryMenu.map((item, i) => (
          <DrawerItem item={item} key={i} />
        ))}
      </div>
    </MuiDrawer>
  );
};

export default React.memo(Drawer);
