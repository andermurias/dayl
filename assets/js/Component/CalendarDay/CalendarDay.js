import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';

import moment from 'moment';
import {format} from '../../Common/Time';

import {darken, lighten} from '@mui/material';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/styles/useTheme';

import AddIcon from '@mui/icons-material/Add';

import {colors} from '../../Common/Colors';

import CalendarTask from '../CalendarTask/CalendarTask';
import Link from '../../Atom/Link';

import {CalendarContext} from '../../_context/CalendarContext';

import {day} from '../../_proptypes/calendar';
import {isDarkTheme} from '../../_config/theme';

const PREFIX = 'CalendarDay';

const classes = {
  dayItem: `${PREFIX}-dayItem`,
  dayItemLink: `${PREFIX}-dayItemLink`,
  dayItemDay: `${PREFIX}-dayItemDay`,
  dayItemToday: `${PREFIX}-dayItemToday`,
  tasksContainer: `${PREFIX}-tasksContainer`,
  taskMore: `${PREFIX}-taskMore`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  [`&.${classes.dayItem}`]: {
    flexGrow: 0,
    maxWidth: `${dayWidth}%`,
    flexBasis: `${dayWidth}%`,
    border: 'solid 1px ' + (isDarkTheme(theme) ? lighten(colors.mineShaft, 0.05) : darken(colors.gallery, 0.03)),
    [theme.breakpoints.down('md')]: {
      border: 'none',
      justifyContent: 'center',
    },
  },

  [`& .${classes.dayItemLink}`]: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    border: 'solid 1px transparent',
    borderRadius: '100%',
    '&:hover': {
      borderColor: colors.orangePeel,
    },
  },

  [`& .${classes.dayItemDay}`]: {
    padding: theme.spacing(0.5),
    borderRadius: '100%',
    height: theme.spacing(4),
    width: theme.spacing(4),
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  [`& .${classes.dayItemToday}`]: {
    background: colors.orangePeel,
    color: colors.richBlack,
  },

  [`& .${classes.tasksContainer}`]: {
    width: '100%',
    display: 'flex',
    height: theme.spacing(4 * (maxTasks + 1)),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      height: theme.spacing(4),
      alignItems: 'center',
    },
  },

  [`& .${classes.taskMore}`]: {
    display: 'inline-flex',
    marginTop: theme.spacing(1),
    maxWidth: '100%',
    border: 0,
  },
}));

const dayWidth = 14.28;
const maxTasks = 3;

const isToday = (date) => format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

const CalendarDay = ({day}) => {
  const theme = useTheme();

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('md'));
  const maxTasksResponsive = isSmlOrDown ? 0 : maxTasks;

  const {handleMoreClick} = useContext(CalendarContext);

  const {t, i18n} = useTranslation();

  return (
    <StyledGrid
      container
      item
      justifyContent="flex-end"
      alignItems="flex-start"
      classes={{root: classes.dayItem}}
      style={{marginLeft: day.monthDay === 1 ? `${dayWidth * day.weekDay}%` : null}}
      xs={12}
    >
      <Link to={day.url} disabled={isSmlOrDown} className={classes.dayItemLink}>
        <Typography
          variant="caption"
          classes={{root: classNames(classes.dayItemDay, {[`${classes.dayItemToday}`]: isToday(day.date)})}}
        >
          {day.monthDay}
        </Typography>
      </Link>
      <div className={classes.tasksContainer}>
        {day.tasks.slice(0, maxTasksResponsive).map((task, i) => (
          <CalendarTask key={i} task={task} />
        ))}

        {day.tasks.length > maxTasksResponsive && (
          <Chip
            variant={isSmlOrDown ? 'default' : 'outlined'}
            color={isSmlOrDown ? 'secondary' : 'primary'}
            size={isSmlOrDown ? 'medium' : 'small'}
            classes={{root: classes.taskMore}}
            icon={isSmlOrDown ? null : <AddIcon />}
            label={
              isSmlOrDown
                ? day.tasks.length - maxTasksResponsive
                : t('calendar.more').replace('%d', (day.tasks.length - maxTasksResponsive).toString())
            }
            onClick={handleMoreClick(day.i)}
          />
        )}
      </div>
    </StyledGrid>
  );
};

CalendarDay.propTypes = {
  day: PropTypes.shape(day),
};

export default React.memo(CalendarDay);
