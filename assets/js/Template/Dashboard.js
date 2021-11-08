import React, {useEffect, useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useTranslation} from 'react-i18next';

import moment from 'moment';
import {parse, parseISO, subDays} from 'date-fns';
import {format} from '../Common/Time';

import {makeStyles} from '@mui/styles';
import Paper from '@mui/material/Paper';

import {useTaskApi} from '../_hook/useTaskApi';
import {useCalendarApi} from '../_hook/useCalendarApi';

import {AppContext} from '../_context/AppContext';

import TaskItemDialog from '../Component/TaskItemDialog/TaskItemDialog';

import DashboardTable from '../Component/DashboardTable/DashboardTable';
import Accordion from '../Component/Accordion/Accordion';
import DashboardHeader from '../Component/DashboardHeader/DashboardHeader';
import {Grid} from '@mui/material';

const PREFIX = 'Dashboard';

const classes = {
  paper: `${PREFIX}-paper`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
  [`&.${classes.paper}`]: {
    boxShadow: 'none',
    border: 0,
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0),
    maxWidth: 1000,
    width: '100%',
    margin: `${theme.spacing(1)} auto`,
    background: 'transparent',
  },
}));

const Dashboard = () => {
  const {t, i18n} = useTranslation();

  const [todayTasks, setTodayTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [pastDayTask, setPastDayTask] = useState({date: null, tasks: []});
  const [calendarEvents, setCalendarEvents] = useState([]);

  const {setLoading} = useContext(AppContext);

  const {getTasksForDashboard} = useTaskApi();
  const {getCalendarEvents} = useCalendarApi();

  const currentDate = new Date();
  const newDate = format(currentDate, 'yyyy-MM-dd');
  const pastDate = format(subDays(currentDate, 1), 'yyyy-MM-dd');

  useEffect(async () => {
    setLoading(true);

    const [pending, done, pastDone] = await getTasksForDashboard(newDate);
    const calendarEvents = await getCalendarEvents(newDate);

    setTodayTasks(done.data);
    setPastDayTask(pastDone.data);
    setPendingTasks(pending.data);
    setCalendarEvents(calendarEvents.data.map((e) => ({description: e.name, ...e})));
    setLoading(false);
  }, []);

  return (
    <StyledPaper classes={{root: classes.paper}}>
      <DashboardHeader currentDate={currentDate} />
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <DashboardTable tasks={pendingTasks} title={t('tasks.pending') + ' (' + pendingTasks.length + ')'} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DashboardTable tasks={calendarEvents} title={t('dashboard.calendar')} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DashboardTable
            tasks={pastDayTask.tasks}
            title={
              t('dashboard.pastDay') +
              ' (' +
              ((pastDayTask && pastDayTask.date && format(parseISO(pastDayTask.date, new Date()), 'P')) || '') +
              ')'
            }
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DashboardTable tasks={todayTasks} title={t('dashboard.today') + ' (' + todayTasks.length + ')'} />
        </Grid>
      </Grid>
      <TaskItemDialog />
    </StyledPaper>
  );
};

export default React.memo(Dashboard);
