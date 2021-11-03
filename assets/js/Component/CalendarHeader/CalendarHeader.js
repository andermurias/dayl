import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';

import moment from 'moment';
import {format} from '../../Common/Time';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import useTheme from '@mui/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Link from '../../Atom/Link';

import {month} from '../../_proptypes/calendar';
import DatePicker from '@mui/lab/DatePicker';

const PREFIX = 'CalendarHeader';

const classes = {
  title: `${PREFIX}-title`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.title}`]: {
    textTransform: 'capitalize',
    textAlign: 'left',
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const CalendarHeader = ({month}) => {
  const theme = useTheme();
  const history = useHistory();

  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [pickerStatus, setPickerStatus] = useState(false);

  const {t, i18n} = useTranslation();

  const onChangeDate = (date) => {
    setSelectedDate(date);
    history.push('/calendar/' + format(date, 'yyyy-MM-01'));
  };

  return (
    <StyledGrid container spacing={3}>
      <Grid container item xs={6} sm={8}>
        <DatePicker
          autoOk
          views={['year', 'month']}
          label="Date Picker"
          showTodayButton={true}
          todayText={t('tasks.today')}
          cancelText={t('tasks.cancel')}
          okText={t('tasks.ok')}
          value={selectedDate}
          open={pickerStatus}
          onOpen={() => setPickerStatus(true)}
          onAccept={() => setPickerStatus(false)}
          onClose={() => setPickerStatus(false)}
          onChange={onChangeDate}
          renderInput={(props) => null}
        />
        <Typography variant="h2" component="h1" className={classes.title} onClick={() => setPickerStatus(true)}>
          {isSmlOrDown ? month.nameShort : month.name}
        </Typography>
      </Grid>
      <Grid container item xs={6} sm={4} justifyContent="flex-end">
        {month.pagination && (
          <>
            <IconButton aria-label="prev" component={Link} to={'/calendar/' + month.pagination.prev} size="large">
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
            <IconButton aria-label="next" component={Link} to={'/calendar/' + month.pagination.next} size="large">
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
    </StyledGrid>
  );
};

CalendarHeader.propTypes = {
  month: PropTypes.shape(month),
};

export default React.memo(CalendarHeader);
