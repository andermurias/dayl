import React from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/styles/useTheme';
import makeStyles from '@mui/styles/makeStyles';

import CalendarDay from '../CalendarDay/CalendarDay';
import CalendarPopover from '../CalendarPopover/CalendarPopover';

import {calendar} from '../../_proptypes/calendar';

const PREFIX = 'Calendar';

const classes = {
  dayHeader: `${PREFIX}-dayHeader`,
  popoverPaper: `${PREFIX}-popoverPaper`,
  popoverTitle: `${PREFIX}-popoverTitle`,
  taskGoTo: `${PREFIX}-taskGoTo`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({theme}) => ({
  [`& .${classes.dayHeader}`]: {
    flexGrow: 0,
    maxWidth: `${dayWidth}%`,
    flexBasis: `${dayWidth}%`,
    textTransform: 'capitalize',
    textAlign: 'center',
    display: 'flex',
    paddingBottom: theme.spacing(2) + '!important',
  },

  [`& .${classes.popoverPaper}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
  },

  [`& .${classes.popoverTitle}`]: {
    width: '100%',
    textAlign: 'center',
    display: 'block',
  },

  [`& .${classes.taskGoTo}`]: {
    display: 'inline-flex',
    marginTop: theme.spacing(1),
    maxWidth: '100%',
    border: 0,
    alignSelf: 'flex-end',
  },
}));

const dayWidth = 14.28;

const Calendar = ({calendarData}) => {
  const theme = useTheme();

  const {t, i18n} = useTranslation();

  const getWeekDays = (isSmlOrDown) =>
    isSmlOrDown ? t('calendar.weekdaysShort', {returnObjects: true}) : t('calendar.weekdays', {returnObjects: true});

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Root>
      <Box mb={2}>
        <Grid container spacing={2}>
          {!!calendarData.days.length &&
            getWeekDays(isSmlOrDown).map((day, i) => (
              <Grid container item justifyContent="center" classes={{root: classes.dayHeader}} key={i}>
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
    </Root>
  );
};

Calendar.propTypes = {
  calendarData: PropTypes.shape(calendar),
};

export default React.memo(Calendar);
