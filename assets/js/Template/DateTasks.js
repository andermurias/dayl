import React, {useEffect, useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import {addSeconds, differenceInSeconds, intervalToDuration, parse} from 'date-fns';
import {format} from '../Common/Time';

import {makeStyles} from '@mui/styles';
import Paper from '@mui/material/Paper';

import {useTaskApi} from '../_hook/useTaskApi';

import {DoneTaskContext} from '../_context/DoneTaskContext';
import {PendingTaskContext} from '../_context/PendingTaskContext';
import {AppContext} from '../_context/AppContext';

import TaskForm from '../Component/TaskForm/TaskForm';
import TaskListHeader from '../Component/TaskListHeader/TaskListHeader';
import TaskItemDialog from '../Component/TaskItemDialog/TaskItemDialog';

import TasksTable from '../Component/TasksTable/TasksTable';
import Accordion from '../Component/Accordion/Accordion';
import { formatDurationToHours } from '../Common/Helper';

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

const getDiffTime = (start, end) => differenceInSeconds(
  parse(end, 'HH:mm', new Date()),
  parse(start, 'HH:mm', new Date())
);

const getTotalTaskDuration = (tasks) => {
  const sumTime = tasks
    .map((t) => (t.start && t.end ? getDiffTime(t.start, t.end) : 0))
    .reduce((sum, time) => sum + time, 0);

    var spendTime = intervalToDuration({ start: 0, end: sumTime * 1000 })
    
  return formatDurationToHours(spendTime);
};

const DateTasks = () => {
  const classes = useStyles();

  const {t, i18n} = useTranslation();

  const [doneTasks] = useContext(DoneTaskContext);
  const [pendingTasks] = useContext(PendingTaskContext);
  const {setLoading, setCurrentDate, editTask} = useContext(AppContext);

  const [taskFormOpen, setTaskFormOpen] = useState(false);

  const {getTasksForDateAndSave} = useTaskApi();

  const query = useParams();
  const currentDate = parse(query.date, 'yyyy-MM-dd', new Date());

  useEffect(() => {
    setLoading(true);
    const currentDate = parse(query.date, 'yyyy-MM-dd',new Date());
    const newDate = format(currentDate, 'yyyy-MM-dd');
    setCurrentDate(newDate);
    getTasksForDateAndSave(newDate).then(() => setLoading(false));
  }, [query.date]);

  const spendTimeFormat = getTotalTaskDuration(doneTasks);

  return (
    <Paper classes={{root: classes.paper}}>
      <TaskListHeader currentDate={currentDate} />
      <Accordion
        expanded={!!editTask || taskFormOpen}
        onChange={() => setTaskFormOpen(!taskFormOpen)}
        defaultExpanded={false}
        title={editTask ? t('tasks.edit') : t('tasks.new')}
      >
        <TaskForm />
      </Accordion>
      <Accordion defaultExpanded={true} title={t('tasks.pending') + ' (' + pendingTasks.length + ')'}>
        <TasksTable tasks={pendingTasks} />
      </Accordion>
      <Accordion
        defaultExpanded={true}
        title={t('tasks.done') + ' (' + doneTasks.length + ')'}
        sideTitle={spendTimeFormat}
      >
        <TasksTable done={true} tasks={doneTasks} />
      </Accordion>
      <TaskItemDialog />
    </Paper>
  );
};

export default React.memo(DateTasks);
