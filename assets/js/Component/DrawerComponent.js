import React, {useContext} from 'react';

import {useTranslation} from 'react-i18next';

import useTheme from '@material-ui/core/styles/useTheme';
import {makeStyles} from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Fab from '@material-ui/core/Fab';
import Hidden from '@material-ui/core/Hidden';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import SearchIcon from '@material-ui/icons/Search';
import GitHubIcon from '@material-ui/icons/GitHub';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import CodeIcon from '@material-ui/icons/Code';
import MenuIcon from '@material-ui/icons/Menu';

import {colors} from '../Common/Colors';

import {logout} from '../Common/Helper';
import {AppContext} from '../_context/AppContext';

import Link from '../Atom/Link';
import Footer from '../Component/Footer';
import DrawerItemComponent from '../Component/DrawerItemComponent';

import logoDark from '../../static/img/logo/dayl_logo_full_dark.svg';
import logo from '../../static/img/logo/dayl_logo_full.svg';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    background: colors.mineShaft,
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
    backgroundColor: theme.palette.background.default,
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

const generateMenuItem = ({text, icon, url, type, subtext, action}) => ({
  text: text,
  subtext: subtext || null,
  Icon: icon,
  url: url || '#',
  type: type || 'item',
  action: action || (() => {}),
});

const generateMenuHeader = ({text}) => generateMenuItem({text: text, type: 'header'});

const generateMenuDivider = () => generateMenuItem({type: 'divider'});

const DrawerComponemt = () => {
  const classes = useStyles();
  const {t} = useTranslation();
  const theme = useTheme();
  const {currentDate, openDrawer, setOpenDrawer, setCloseDrawer} = useContext(AppContext);

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('sm'));

  const mainMenu = [
    generateMenuItem({
      icon: CalendarTodayIcon,
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
      icon: SearchIcon,
      text: t('menu.search'),
      url: '/search',
    }),
    generateMenuHeader({
      text: t('menu.header.more'),
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
    <Drawer
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
            <DrawerItemComponent item={item} key={i} />
          ))}
        </List>
      </div>
      <div className={classes.bottomList}>
        {secondaryMenu.map((item, i) => (
          <DrawerItemComponent item={item} key={i} />
        ))}
      </div>
    </Drawer>
  );
};

export default React.memo(DrawerComponemt);
