import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';

import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Link from '../../Atom/Link';

import {month} from '../../_proptypes/calendar';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: 'capitalize',
    textAlign: 'left',
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const CalendarHeader = ({month}) => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [pickerStatus, setPickerStatus] = useState(false);

  const {t, i18n} = useTranslation();
  moment.locale(i18n.language);

  const onChangeDate = (date) => {
    setSelectedDate(date);
    history.push('/calendar/' + moment(date).format('YYYY-MM-01'));
  };

  return (
    <Grid container spacing={3}>
      <Grid container item xs={6} sm={8}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            autoOk
            views={['year', 'month']}
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
        <Typography variant="h2" component="h1" className={classes.title} onClick={() => setPickerStatus(true)}>
          {isSmlOrDown ? month.nameShort : month.name}
        </Typography>
      </Grid>
      <Grid container item xs={6} sm={4} justify="flex-end">
        {month.pagination && (
          <>
            <IconButton aria-label="prev" component={Link} to={'/calendar/' + month.pagination.prev}>
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
            <IconButton aria-label="next" component={Link} to={'/calendar/' + month.pagination.next}>
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </>
        )}
      </Grid>
      <Grid container item xs={12}>
        <Typography variant="overline" component="h3">
          {t('calendar.amount').replace('%d', month.tasksTotal.toString()).replace('%s', month.name)}
        </Typography>
      </Grid>
    </Grid>
  );
};

CalendarHeader.propTypes = {
  month: PropTypes.shape(month),
};

export default React.memo(CalendarHeader);
