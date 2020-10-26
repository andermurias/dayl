import React, {useContext, useEffect, useState} from 'react';

import {useTranslation} from 'react-i18next';
import moment from 'moment';

import useTheme from '@material-ui/core/styles/useTheme';
import {lighten, makeStyles} from '@material-ui/core/styles';

import MuiDrawer from '@material-ui/core/Drawer';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';

import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import {colors} from '../../Common/Colors';
import {AppContext} from '../../_context/AppContext';
import {useCalendarApi} from '../../_hook/useCalendarApi';

import {ADD_TASK, EDIT_TASK, useTaskProcessor} from '../../_hook/useTaskProcessor';

export const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    maxWidth: '100%',
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    maxWidth: '100%',
    justifyContent: 'space-between',
  },
  eventList: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  event: {
    background: lighten(colors.orangePeel, 0.3),
    borderRadius: 4,
    marginTop: theme.spacing(2),
    paddingRight: theme.spacing(11),
  },
  eventText: {
    color: colors.mineShaft,
  },
  eventIcon: {
    fill: colors.mineShaft,
  },
}));

const CalendarEvents = () => {
  const classes = useStyles();
  const theme = useTheme();
  const {t} = useTranslation();
  const {getCalendarEvents} = useCalendarApi();
  const {processTask} = useTaskProcessor();
  const {openCalendarEvents, currentDate, setOpenCalendarEvents} = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMediumOrDown = useMediaQuery(theme.breakpoints.down('md'));

  const date = moment(currentDate, 'YYYY-MM-DD').format('LL');

  useEffect(() => {
    setLoading(true);
    getCalendarEvents(currentDate).then((data) => {
      setEvents(data.data);
      setLoading(false);
    });
  }, [currentDate]);

  const addEventToTaskList = (done) => (event) => () =>
    processTask(ADD_TASK, {
      description: event.name,
      start: event.start,
      end: event.end,
      date: done ? currentDate : null,
      deadline: currentDate,
    });

  const setEventToEdit = (event) => () =>
    processTask(EDIT_TASK, {
      id: 0,
      description: event.name,
      start: event.start,
      end: event.end,
      date: null,
      deadline: currentDate,
    });

  return (
    <MuiDrawer
      className={classes.drawer}
      variant={isMediumOrDown ? 'temporary' : 'persistent'}
      open={openCalendarEvents}
      classes={{
        paper: classes.drawerPaper,
      }}
      ModalProps={{
        onBackdropClick: () => setOpenCalendarEvents(false),
      }}
      anchor="right"
    >
      <List dense classes={{root: classes.eventList}}>
        <ListItem>
          <ListItemText
            primaryTypographyProps={{variant: 'h5', color: 'primary'}}
            primary={t('calendar.events')}
            secondary={date}
            secondaryTypographyProps={{variant: 'body2'}}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="close" onClick={() => setOpenCalendarEvents(false)}>
              <CloseIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {!loading ? (
          events.map((item, i) => (
            <ListItem dense key={i} classes={{root: classes.event}}>
              <ListItemText
                primaryTypographyProps={{variant: 'body2', className: classes.eventText}}
                secondaryTypographyProps={{variant: 'caption', className: classes.eventText}}
                primary={item.name}
                secondary={item.start + ' - ' + item.end}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="Edit" onClick={setEventToEdit(item)}>
                  <EditOutlinedIcon className={classes.eventIcon} />
                </IconButton>
                {/*<IconButton edge="end" aria-label="Save" onClick={addEventToTaskList(false)(item)}>*/}
                {/*  <AddIcon className={classes.eventIcon} />*/}
                {/*</IconButton>*/}
                <IconButton edge="end" aria-label="Save" onClick={addEventToTaskList(true)(item)}>
                  <PlaylistAddCheckIcon className={classes.eventIcon} />
                </IconButton>
              </ListItemSecondaryAction>
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
