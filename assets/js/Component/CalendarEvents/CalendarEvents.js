import React, {useContext, useEffect, useState} from 'react';

import {useTranslation} from 'react-i18next';

import useTheme from '@material-ui/core/styles/useTheme';
import {makeStyles} from '@material-ui/core/styles';

import MuiDrawer from '@material-ui/core/Drawer';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {colors} from '../../Common/Colors';

import {AppContext} from '../../_context/AppContext';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {useCalendarApi} from '../../_hook/useCalendarApi';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';

const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    maxWidth: '100%',
    flexShrink: 0,
    background: colors.mineShaft,
  },
  drawerPaper: {
    width: drawerWidth,
    maxWidth: '100%',
    justifyContent: 'space-between',
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

const CalendarEvents = () => {
  const classes = useStyles();
  const {t} = useTranslation();
  const theme = useTheme();
  const {getCalendarEvents} = useCalendarApi();
  const {openCalendarEvents, currentDate, token} = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fix if token does not exists for all requests
    if (token) {
      setLoading(true);
      getCalendarEvents(currentDate).then((data) => {
        setEvents(data.data);
        setLoading(false);
      });
    }
  }, [currentDate, token]);

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MuiDrawer
      className={classes.drawer}
      variant="persistent"
      open={openCalendarEvents}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="right"
    >
      <List dense>
        <ListItem>
          <ListItemText primaryTypographyProps={{variant: 'h4', color: 'secondary'}} primary={t('calendar.events')} />
        </ListItem>
        {!loading ? (
          events.map((item, i) => (
            <ListItem dense divider key={i}>
              <ListItemText
                primaryTypographyProps={{variant: 'body2', color: 'primary'}}
                secondaryTypographyProps={{variant: 'caption', color: 'primary'}}
                primary={item.name}
                secondary={item.start + ' - ' + item.end}
              />
            </ListItem>
          ))
        ) : (
          <LinearProgress color="secondary" />
        )}
      </List>
    </MuiDrawer>
  );
};

export default React.memo(CalendarEvents);
