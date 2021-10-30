import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import makeStyles from '@mui/styles/makeStyles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {CalendarContext} from '../../_context/CalendarContext';

import Link from '../../Atom/Link';
import CalendarTask from '../CalendarTask/CalendarTask';

import {calendar} from '../../_proptypes/calendar';
import {format} from '../../Common/Time';

const useStyles = makeStyles((theme) => ({
  popoverPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
      left: '0px!important',
      top: 'auto!important',
      bottom: 0,
    },
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

const CalendarPopover = ({calendarData}) => {
  const classes = useStyles();

  const {t} = useTranslation();

  const {popoverAnchor, handlePopoverClose, popoverDayIdx} = useContext(CalendarContext);

  return (
    <Popover
      id="more-task-popover"
      classes={{
        paper: classes.popoverPaper,
      }}
      elevation={0}
      open={Boolean(popoverAnchor)}
      anchorEl={popoverAnchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >
      {popoverAnchor && (
        <>
          <Typography variant="caption" classes={{root: classes.popoverTitle}}>
            {format(calendarData.days[popoverDayIdx].date, 'EEEEE')}
          </Typography>
          <Typography variant="h4" classes={{root: classes.popoverTitle}}>
            {format(calendarData.days[popoverDayIdx].date, 'dd')}
          </Typography>
          <Typography variant="caption" classes={{root: classes.popoverTitle}}>
            {t('calendar.popover.count').replace('%s', calendarData.days[popoverDayIdx].tasks.length)}
          </Typography>
          <Box my={1}>
            <Divider variant="fullWidth" style={{width: '100%'}} />
          </Box>
          {calendarData.days[popoverDayIdx].tasks.map((task, i) => (
            <CalendarTask key={i} task={task} />
          ))}
          <Chip
            clickable
            variant="outlined"
            size="small"
            classes={{root: classes.taskGoTo}}
            icon={<ArrowForwardIcon />}
            component={Link}
            to={'/tasks/' + format(calendarData.days[popoverDayIdx].date, 'yyyy-MM-dd')}
            label={t('calendar.goto').replace('%s', format(calendarData.days[popoverDayIdx].date, 'P'))}
          />
        </>
      )}
    </Popover>
  );
};

CalendarPopover.propTypes = {
  calendarData: PropTypes.shape(calendar),
};

export default React.memo(CalendarPopover);
