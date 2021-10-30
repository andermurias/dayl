import React, {useEffect, useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';

import moment from 'moment';
import {addDays, parse} from 'date-fns';
import {format} from '../Common/Time';

import {makeStyles} from '@mui/styles';
import Paper from '@mui/material/Paper';

import {useTaskApi} from '../_hook/useTaskApi';

import {AppContext} from '../_context/AppContext';

import TaskItemDialog from '../Component/TaskItemDialog/TaskItemDialog';

import TasksTable from '../Component/TasksTable/TasksTable';
import Accordion from '../Component/Accordion/Accordion';
import DashboardHeader from "../Component/DashboardHeader/DashboardHeader";

const useStyles = makeStyles((theme) => ({
  paper: {
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

  const classes = useStyles();

  const {t, i18n} = useTranslation();


  const [todayTasks, setTodayTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [pastDayTask, setPastDayTask] = useState([]);

  const {setLoading} = useContext(AppContext);

  const {getTasksForDashboard} = useTaskApi();

  const currentDate = new Date();
  const newDate = format(currentDate, 'yyyy-MM-dd');
  const pastDate = format(addDays(currentDate, 1), 'yyyy-MM-dd');

  useEffect(() => {
    setLoading(true);

    getTasksForDashboard(newDate, pastDate).then(([pending, done, pastDone]) => {
      setTodayTasks(done.data);
      setPastDayTask(pastDone.data);
      setPendingTasks(pending.data);
      setLoading(false);
    });
  }, []);

  return (
    <Paper classes={{root: classes.paper}}>
      <DashboardHeader currentDate={currentDate}/>
      <Accordion defaultExpanded={true} title={t('tasks.pending') + ' (' + pendingTasks.length + ')'}>
        <TasksTable tasks={pendingTasks} withActions={false}/>
      </Accordion>
      <Accordion
        defaultExpanded={true}
        title={t('dashboard.today') + ' (' + todayTasks.length + ')'}
      >
        <TasksTable done={true} tasks={todayTasks} withActions={false}/>
      </Accordion>
      <Accordion
        defaultExpanded={true}
        title={t('dashboard.yesterday') + ' (' + pastDayTask.length + ')'}
      >
        <TasksTable done={true} tasks={pastDayTask} withActions={false}/>
      </Accordion>
      <TaskItemDialog/>
    </Paper>
  );
};

export default React.memo(Dashboard);
