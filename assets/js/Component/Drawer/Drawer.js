import React, {useContext, useState} from 'react';

import {styled} from '@mui/material/styles';

import {useTranslation} from 'react-i18next';

import useTheme from '@mui/styles/useTheme';
import {makeStyles} from '@mui/styles';

import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import useMediaQuery from '@mui/material/useMediaQuery';

import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SearchIcon from '@mui/icons-material/Search';
import GitHubIcon from '@mui/icons-material/GitHub';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TodayIcon from '@mui/icons-material/Today';
import CodeIcon from '@mui/icons-material/Code';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import {colors} from '../../Common/Colors';

import {logout, THEME_DARK, THEME_LIGHT} from '../../Common/Helper';
import {AppContext} from '../../_context/AppContext';

import Link from '../../Atom/Link';
import DrawerItem from '../DrawerItem/DrawerItem';

import logoDark from '../../../static/img/logo/dayl_logo_full_dark.svg';
import logo from '../../../static/img/logo/dayl_logo_full.svg';
import {isDarkTheme} from '../../_config/theme';
import {style} from '@mui/system';
import {useTaskApi} from '../../_hook/useTaskApi';
import {format} from 'date-fns';

const PREFIX = 'Drawer';

const classes = {
  drawer: `${PREFIX}-drawer`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  toolbar: `${PREFIX}-toolbar`,
  content: `${PREFIX}-content`,
  fab: `${PREFIX}-fab`,
  logo: `${PREFIX}-logo`,
  topList: `${PREFIX}-topList`,
  bottomList: `${PREFIX}-bottomList`,
};

const dialogClasses = {
  dateSelector: `${PREFIX}-dateSelector`,
  dialogText: `${PREFIX}-dialogText`,
};

const StyledMuiDrawer = styled(MuiDrawer)(({theme}) => ({
  [`&.${classes.drawer}`]: {
    width: drawerWidth,
    flexShrink: 0,
  },

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
    backgroundImage: 'none',
    justifyContent: 'space-between',
  },

  [`& .${classes.toolbar}`]: {
    padding: theme.spacing(4, 2, 1, 2),
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    backgroundColor: colors.mineShaft,
    padding: theme.spacing(3),
    position: 'relative',
    flexDirection: 'column',
  },

  [`& .${classes.fab}`]: {
    margin: theme.spacing(1),
    position: 'fixed',
    bottom: theme.spacing(1),
    left: theme.spacing(1),
  },

  [`& .${classes.logo}`]: {
    width: '66%',
  },

  [`& .${classes.topList}`]: {},

  [`& .${classes.bottomList}`]: {
    paddingBottom: theme.spacing(2),
  },
}));

const StyledDialog = styled(Dialog)(({theme}) => ({
  [`& .${dialogClasses.dialogText}`]: {
    marginBottom: theme.spacing(4),
  },

  [`& .${dialogClasses.dateSelector}`]: {
    width: '100%',
  },
}));

const drawerWidth = 180;

const generateMenuItem = ({text, icon, url, type, subtext, checked, action, closeDrawer}) => ({
  text: text,
  subtext: subtext || null,
  Icon: icon,
  url: url || '#',
  type: type || 'item',
  checked: checked || false,
  closeDrawer: closeDrawer === true || closeDrawer === false ? closeDrawer : true,
  action: action || (() => {}),
});
const generateMenuHeader = ({text}) => generateMenuItem({text: text, type: 'header'});

const generateMenuDivider = () => generateMenuItem({type: 'divider'});

const generateMenuSwitch = ({text, icon, action, checked}) =>
  generateMenuItem({text: text, icon: icon, type: 'switch', checked: checked, action: action});

const Drawer = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {currentDate, openDrawer, setCloseDrawer, openCalendarEvents, setOpenCalendarEvents} = useContext(AppContext);

  const {getExportTaskForRange} = useTaskApi();

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [startDate, handleStartDateChange] = useState(new Date());
  const [endDate, handleEndDateChange] = useState(new Date());

  const closeExportDialog = () => setExportDialogOpen(false);

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('md'));

  const generateCsvFile = () => {
    getExportTaskForRange(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
  };

  const mainMenu = [
    generateMenuItem({
      icon: TodayIcon,
      text: t('menu.dashboard'),
      url: '/dashboard',
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
      text: t('menu.export'),
      icon: ImportExportIcon,
      closeDrawer: false,
      action: () => {
        setExportDialogOpen(true);
      },
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
    <StyledMuiDrawer
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
            <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo} />
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
      <StyledDialog open={exportDialogOpen} onClose={closeExportDialog}>
        <DialogTitle>{t('export.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText classes={{root: dialogClasses.dialogText}}>{t('export.message')}</DialogContentText>
          <Grid container spacing={2}>
            <Grid container item xs={12} sm={12} md={6}>
              <DatePicker
                id="export-start"
                label={t('form.start')}
                minutesStep={5}
                classes={{root: dialogClasses.dateSelector}}
                ampm={false}
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={(props) => <TextField classes={{root: dialogClasses.dateSelector}} {...props} />}
                fullWidth
                autoOk
              />
            </Grid>
            <Grid container item xs={12} sm={12} md={6}>
              <DatePicker
                id="export-end"
                label={t('form.end')}
                minutesStep={5}
                ampm={false}
                value={endDate}
                onChange={handleEndDateChange}
                renderInput={(props) => <TextField classes={{root: dialogClasses.dateSelector}} {...props} />}
                fullWidth
                autoOk
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeExportDialog}>{t('export.cancel')}</Button>
          <Button onClick={generateCsvFile}>{t('export.save')}</Button>
        </DialogActions>
      </StyledDialog>
    </StyledMuiDrawer>
  );
};

export default React.memo(Drawer);
