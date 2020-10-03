import React, {useContext} from 'react';
import {CalendarContext} from '../../_context/CalendarContext';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CalendarDay from '../CalendarDay/CalendarDay';
import CalendarPopover from '../CalendarPopover/CalendarPopover';
import moment from 'moment';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {useTranslation} from 'react-i18next';

const dayWidth = 14.28;

const useStyles = makeStyles((theme) => ({
  dayHeader: {
    flexGrow: 0,
    maxWidth: `${dayWidth}%`,
    flexBasis: `${dayWidth}%`,
    textTransform: 'capitalize',
    textAlign: 'center',
    display: 'flex',
    paddingBottom: theme.spacing(2) + '!important',
  },
  popoverPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
  },
  popoverTitle: {
    width: '100%',
    textAlign: 'center',
    display: 'block',
  },
  taskGoTo: {
    display: 'inline-flex',
    marginTop: theme.spacing(1),
    maxWidth: '100%',
    border: 0,
    alignSelf: 'flex-end',
  },
}));

const Calendar = ({calendarData}) => {
  const classes = useStyles();
  const theme = useTheme();

  const {i18n} = useTranslation();
  moment.locale(i18n.language);

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('sm'));

  const getWeekDays = () => (isSmlOrDown ? moment.weekdaysMin(true) : moment.weekdays(true));

  return (
    <>
      <Box mb={2}>
        <Grid container spacing={2}>
          {!!calendarData.days.length &&
            getWeekDays().map((day, i) => (
              <Grid container item justify="center" classes={{root: classes.dayHeader}} key={i}>
                <Typography variant="h6">{day}</Typography>
              </Grid>
            ))}
        </Grid>
      </Box>
      <Grid container spacing={2}>
        {calendarData.days.map((day, i) => (
          <CalendarDay day={day} key={i} />
        ))}
      </Grid>
      <CalendarPopover calendarData={calendarData} />
    </>
  );
};

export default React.memo(Calendar);
