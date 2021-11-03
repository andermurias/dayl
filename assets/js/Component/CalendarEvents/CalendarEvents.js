import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';

import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {parse} from 'date-fns';
import {format} from '../../Common/Time';

import useTheme from '@mui/styles/useTheme';
import {lighten} from '@mui/material/styles';
import {makeStyles} from '@mui/styles';

import MuiDrawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import LinearProgress from '@mui/material/LinearProgress';

import CloseIcon from '@mui/icons-material/Close';
//import AddIcon from '@mui/icons-material/Add';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {colors} from '../../Common/Colors';
import {AppContext} from '../../_context/AppContext';
import {useCalendarApi} from '../../_hook/useCalendarApi';

import {ADD_TASK, EDIT_TASK, useTaskProcessor} from '../../_hook/useTaskProcessor';

const PREFIX = 'CalendarEvents';

const classes = {
  title: `${PREFIX}-title`,
  drawer: `${PREFIX}-drawer`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  eventList: `${PREFIX}-eventList`,
  event: `${PREFIX}-event`,
  eventTitle: `${PREFIX}-eventTitle`,
  eventText: `${PREFIX}-eventText`,
  eventIcon: `${PREFIX}-eventIcon`,
};

const StyledMuiDrawer = styled(MuiDrawer)(({theme}) => ({
  [`& .${classes.title}`]: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
  },

  [`&.${classes.drawer}`]: {
    width: drawerWidth,
    maxWidth: '100%',
    flexShrink: 0,
  },

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
    maxWidth: '100%',
    justifyContent: 'space-between',
  },

  [`& .${classes.eventList}`]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },

  [`& .${classes.event}`]: {
    background: lighten(colors.orangePeel, 0.3),
    borderRadius: 4,
    marginTop: theme.spacing(2),
    paddingRight: theme.spacing(11),
  },

  [`& .${classes.eventTitle}`]: {
    fontWeight: '600',
  },

  [`& .${classes.eventText}`]: {
    color: colors.mineShaft,
  },

  [`& .${classes.eventIcon}`]: {
    fill: colors.mineShaft,
  },
}));

export const drawerWidth = 320;

const CalendarEvents = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const {getCalendarEvents} = useCalendarApi();
  const {processTask} = useTaskProcessor();
  const {openCalendarEvents, currentDate, setOpenCalendarEvents} = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMediumOrDown = useMediaQuery(theme.breakpoints.down('lg'));

  const date = format(parse(currentDate, 'yyyy-MM-dd', new Date()), 'PP');

  useEffect(() => {
    setLoading(true);
    getCalendarEvents(currentDate).then((data) => {
      setEvents(data.data);
      setLoading(false);
    });
  }, [currentDate]);

  const addEventToTaskList = (done) => (event) => () => {
    processTask(ADD_TASK, {
      description: event.name,
      start: event.start,
      end: event.end,
      date: done ? currentDate : null,
      deadline: currentDate,
    });
    if (isMediumOrDown) {
      setOpenCalendarEvents(false);
    }
  };

  const setEventToEdit = (event) => () => {
    processTask(EDIT_TASK, {
      id: 0,
      description: event.name,
      start: event.start,
      end: event.end,
      date: null,
      deadline: currentDate,
    });
    if (isMediumOrDown) {
      setOpenCalendarEvents(false);
    }
  };

  return (
    <StyledMuiDrawer
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
            classes={{root: classes.title}}
            primaryTypographyProps={{variant: 'h5', color: 'primary'}}
            primary={t('calendar.events')}
            secondary={date}
            secondaryTypographyProps={{variant: 'body2'}}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="close" onClick={() => setOpenCalendarEvents(false)} size="large">
              <CloseIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {!loading ? (
          events.map((item, i) => (
            <ListItem dense key={i} classes={{root: classes.event}}>
              <ListItemText
                primaryTypographyProps={{
                  variant: 'body2',
                  className: classNames(classes.eventText, classes.eventTitle),
                }}
                secondaryTypographyProps={{variant: 'caption', className: classes.eventText}}
                primary={item.name}
                secondary={item.start + ' - ' + item.end}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="Edit" onClick={setEventToEdit(item)} size="large">
                  <EditOutlinedIcon className={classes.eventIcon} />
                </IconButton>
                {/*<IconButton edge="end" aria-label="Save" onClick={addEventToTaskList(false)(item)}>*/}
                {/*  <AddIcon className={classes.eventIcon} />*/}
                {/*</IconButton>*/}
                <IconButton edge="end" aria-label="Save" onClick={addEventToTaskList(true)(item)} size="large">
                  <PlaylistAddCheckIcon className={classes.eventIcon} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <LinearProgress color="secondary" />
        )}
      </List>
    </StyledMuiDrawer>
  );
};
export default React.memo(CalendarEvents);
