import React, {useContext} from 'react';
import Link from '../../Atom/Link';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {lighten} from '@material-ui/core';
import {colors} from '../../Common/Colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import CalendarTask from '../CalendarTask/CalendarTask';
import {CalendarContext} from '../../_context/CalendarContext';

const dayWidth = 14.28;
const maxTasks = 3;

const useStyles = makeStyles((theme) => ({
  dayItem: {
    flexGrow: 0,
    maxWidth: `${dayWidth}%`,
    flexBasis: `${dayWidth}%`,
    border: 'solid 1px ' + lighten(colors.mineShaft, 0.05),
    [theme.breakpoints.down('sm')]: {
      border: 'none',
      justifyContent: 'center',
    },
  },
  dayItemLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    border: 'solid 1px transparent',
    borderRadius: '100%',
    '&:hover': {
      borderColor: theme.palette.text.primary,
    },
  },
  dayItemDay: {
    padding: theme.spacing(0.5),
    borderRadius: '100%',
    height: theme.spacing(4),
    width: theme.spacing(4),
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayItemToday: {
    background: colors.orangePeel,
    color: colors.richBlack,
  },
  tasksContainer: {
    width: '100%',
    display: 'flex',
    height: theme.spacing(4) * (maxTasks + 1),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(4),
      alignItems: 'center',
    },
  },
  taskMore: {
    display: 'inline-flex',
    marginTop: theme.spacing(1),
    maxWidth: '100%',
    border: 0,
  },
}));

const CalendarDay = ({day}) => {
  const classes = useStyles();
  const theme = useTheme();

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('sm'));
  const maxTasksResponsive = isSmlOrDown ? 0 : maxTasks;

  const {handleMoreClick} = useContext(CalendarContext);

  const {t, i18n} = useTranslation();
  moment.locale(i18n.language);

  const isToday = (date) => date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');

  return (
    <Grid
      container
      item
      justify="flex-end"
      alignItems="flex-start"
      classes={{root: classes.dayItem}}
      style={{marginLeft: day.monthDay === 1 ? `${dayWidth * day.weekDay}%` : null}}
      xs={12}
    >
      <Link to={day.url} className={classes.dayItemLink}>
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
    </Grid>
  );
};

export default React.memo(CalendarDay);