import React, {useEffect, useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import makeStyles from '@mui/styles/makeStyles';

import Paper from '@mui/material/Paper';

import {useTaskApi} from '../_hook/useTaskApi';
import {AppContext} from '../_context/AppContext';

import CalendarHeader from '../Component/CalendarHeader/CalendarHeader';
import Empty from '../Component/Empty/Empty';
import CCalendar from '../Component/Calendar/Calendar';
import {CalendarProvider} from '../_context/CalendarContext';
import { addDays, addMonths, endOfMonth, getDaysInMonth, parse, startOfMonth, subMonths } from 'date-fns';
import {format} from '../Common/Time';

const useStyles = makeStyles((theme) => ({
  paper: {
    boxShadow: 'none',
    border: 0,
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(2),
    maxWidth: 1200,
    width: '100%',
    margin: `${theme.spacing(1)} auto`,
    background: 'transparent',
  },
}));

const generateDateRangeForDate = (date) => {
  const dateObject = parse(date, 'yyyy-MM-dd', new Date());
  return {
    start: format(startOfMonth(dateObject), 'yyyy-MM-dd'),
    end: format(endOfMonth(dateObject), 'yyyy-MM-dd'),
    days: getDaysInMonth(dateObject),
  };
};

const filterTasksForCurrentDate = (currentDate) => (task) =>
  format(parse(task.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

const generateCalendarStructureFromRange = ({start, end, days, tasks}) => {
  
  const startDate = parse(start, 'yyyy-MM-dd', new Date());

  return {
  month: {
    name: format(startDate, 'LLLL'),
    nameShort: format(startDate, 'LLL'),
    number: parseInt(format(startDate, 'LL')),
    start: startDate,
    end: end,
    days: days,
    tasksTotal: tasks.length,
    pagination: {
      current: format(startDate, 'yyyy-MM-dd'),
      next: format(addMonths(startDate, 1), 'yyyy-MM-dd'),
      prev: format(subMonths(startDate, 1), 'yyyy-MM-dd'),
    },
  },
  days: new Array(days)
    .fill({
      start,
      end,
    })
    .map(({start, end}, i) => {
      const currentDate = addDays(startDate, i);
      console.log(currentDate, format(currentDate, 'e'));
      return {
        i: i,
        date: currentDate,
        monthDay: parseInt(format(currentDate, 'd')),
        weekDay: parseInt(format(currentDate, 'e')),
        weekDayStr: format(currentDate, 'EEEE'),
        url: '/tasks/' + format(currentDate, 'yyyy-MM-dd'),
        tasks: tasks.filter(filterTasksForCurrentDate(currentDate)),
      };
    }),
};
}

const Calendar = () => {
  const classes = useStyles();
  const query = useParams();

  const {i18n} = useTranslation();

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
