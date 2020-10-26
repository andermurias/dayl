import React, {useEffect, useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import makeStyles from '@material-ui/core/styles/makeStyles';

import Paper from '@material-ui/core/Paper';

import {useTaskApi} from '../_hook/useTaskApi';
import {AppContext} from '../_context/AppContext';

import CalendarHeader from '../Component/CalendarHeader/CalendarHeader';
import Empty from '../Component/Empty/Empty';
import CCalendar from '../Component/Calendar/Calendar';
import {CalendarProvider} from '../_context/CalendarContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    boxShadow: 'none',
    border: 0,
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(2),
    maxWidth: 1200,
    width: '100%',
    margin: `${theme.spacing(1)}px auto`,
    background: 'transparent',
  },
}));

const generateDateRangeForDate = (date) => {
  const dateObject = moment(date, 'YYYY-MM-DD');
  return {
    start: dateObject.startOf('month').format('YYYY-MM-DD'),
    end: dateObject.endOf('month').format('YYYY-MM-DD'),
    days: dateObject.daysInMonth(),
  };
};

const filterTasksForCurrentDate = (currentDate) => (task) =>
  moment(task.date).format('YYYY-MM-DD') === currentDate.format('YYYY-MM-DD');

const generateCalendarStructureFromRange = ({start, end, days, tasks}) => ({
  month: {
    name: moment(start).format('MMMM'),
    nameShort: moment(start).format('MMM'),
    number: parseInt(moment(start).format('MM')),
    start: start,
    end: end,
    days: days,
    tasksTotal: tasks.length,
    pagination: {
      current: moment(start).format('YYYY-MM-DD'),
      next: moment(moment(start)).add(1, 'month').format('YYYY-MM-DD'),
      prev: moment(moment(start)).subtract(1, 'month').format('YYYY-MM-DD'),
    },
  },
  days: new Array(days)
    .fill({
      start,
      end,
    })
    .map(({start, end}, i) => {
      const currentDate = moment(moment(start, 'YYYY-MM-DD').add(i, 'days').toDate());
      return {
        i: i,
        date: currentDate,
        monthDay: parseInt(currentDate.format('D')),
        weekDay: parseInt(currentDate.format('e')),
        weekDayStr: currentDate.format('dddd'),
        url: '/tasks/' + currentDate.format('YYYY-MM-DD'),
        tasks: tasks.filter(filterTasksForCurrentDate(currentDate)),
      };
    }),
});

const Calendar = () => {
  const classes = useStyles();
  const query = useParams();

  const {i18n} = useTranslation();
  moment.locale(i18n.language);

  const {currentDate, setLoading} = useContext(AppContext);

  const [calendarData, setCalendarData] = useState({month: {}, days: []});

  const {getTasksForRange} = useTaskApi();

  useEffect(() => {
    setLoading(true);
    const dateRange = generateDateRangeForDate(query.date || currentDate);
    getTasksForRange({start: dateRange.start, end: dateRange.end}).then(({data}) => {
      setCalendarData(
        generateCalendarStructureFromRange({
          ...dateRange,
          tasks: data,
        }),
      );
      setLoading(false);
    });
  }, [query]);

  return (
    <CalendarProvider>
      {!!calendarData.days.length ? (
        <Paper classes={{root: classes.paper}} elevation={0}>
          <CalendarHeader month={calendarData.month} />
          <CCalendar calendarData={calendarData} />
        </Paper>
      ) : (
        <Empty />
      )}
    </CalendarProvider>
  );
};

export default React.memo(Calendar);
