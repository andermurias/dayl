import React, {useEffect, useRef, useState} from 'react';

import {Link, useHistory} from 'react-router-dom';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames/bind';

import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: 'capitalize',
    textAlign: 'center',
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  subtitle: {
    width: '100%',
    textTransform: 'uppercase',
    //    fontSize: '1rem',
    lineHeight: 1.5,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  left: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'left',
    },
  },
  right: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'right',
    },
  },
  titleSecondary: {
    opacity: '.3',
    fontWeight: 'regular',
  },
  datePicker: {
    display: 'none',
  },
}));

const TaskListHeader = ({currentDate}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallOrUp = useMediaQuery(theme.breakpoints.up('sm'));

  const history = useHistory();
  const {t} = useTranslation();

  const [selectedDate, setSelectedDate] = useState(moment(currentDate).format('YYYY-MM-DD'));
  const [pickerStatus, setPickerStatus] = useState(false);

  const prevDate = moment(currentDate).subtract(1, 'day').format('YYYY-MM-DD');
  const nexDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');

  const onChangeDate = (date) => {
    setSelectedDate(date);
    history.push('/tasks/' + moment(date).format('YYYY-MM-DD'));
  };
  return (
    <Box>
      <Box mb={4}>
        <Grid container spacing={1}>
          <Grid container item xs={2} sm={1}>
            <IconButton aria-label="prev" component={Link} to={'/tasks/' + prevDate}>
              <ChevronLeftIcon />
            </IconButton>
          </Grid>
          <Grid container item xs={8} sm={10}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label="Date Picker"
                showTodayButton={true}
                todayLabel={t('tasks.today')}
                cancelLabel={t('tasks.cancel')}
                okLabel={t('tasks.ok')}
                value={selectedDate}
                open={pickerStatus}
                onOpen={() => setPickerStatus(true)}
                onAccept={() => setPickerStatus(false)}
                onClose={() => setPickerStatus(false)}
                onChange={onChangeDate}
                TextFieldComponent={() => null}
              />
            </MuiPickersUtilsProvider>
            <Typography variant="h5" component="h1" className={classes.title} onClick={() => setPickerStatus(true)}>
              {currentDate.format('dddd')}
            </Typography>
            <Typography variant="h6" component="h2" className={classes.title} onClick={() => setPickerStatus(true)}>
              <span className={classes.titleSecondary}>({moment(currentDate).format(isSmallOrUp ? 'LL' : 'L')})</span>
            </Typography>
          </Grid>
          <Grid container item xs={2} sm={1}>
            <IconButton aria-label="next" component={Link} to={'/tasks/' + nexDate}>
              <ChevronRightIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Hidden xsDown>
        <Box m={2}>
          <Grid container spacing={1}>
            <Grid container item sm={6} xs={12}>
              <Typography variant="overline" component="h3" className={classNames(classes.subtitle, classes.left)}>
                {t('tasks.header.week')} {moment(currentDate).format('w')}
              </Typography>
            </Grid>
            <Grid container item sm={6} xs={12}>
              <Typography variant="overline" component="h3" className={classNames(classes.subtitle, classes.right)}>
                {moment(currentDate).startOf('week').format('L')} - {moment(currentDate).endOf('week').format('L')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Hidden>
    </Box>
  );
};

export default React.memo(TaskListHeader);
