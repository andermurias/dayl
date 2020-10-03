import React, {useEffect, useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import {useTaskApi} from '../_hook/useTaskApi';

import {DoneTaskContext} from '../_context/DoneTaskContext';
import {PendingTaskContext} from '../_context/PendingTaskContext';
import {AppContext} from '../_context/AppContext';

import TaskForm from '../Component/TaskForm/TaskForm';
import TaskListHeader from '../Component/TaskListHeader/TaskListHeader';
import TaskItemDialog from '../Component/TaskItemDialog/TaskItemDialog';

import {withLayout} from '../_hoc/withLayout';

import TasksTable from '../Component/TasksTable/TasksTable';
import Accordion from '../Component/Accordion/Accordion';
import MainLayout from '../Layout/MainLayout';

const useStyles = makeStyles((theme) => ({
  paper: {
    boxShadow: 'none',
    border: 0,
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0),
    maxWidth: 1000,
    width: '100%',
    margin: `${theme.spacing(1)}px auto`,
    background: 'transparent',
  },
}));

const getDiffTime = (start, end) => moment(end, 'HH:mm').diff(moment(start, 'HH:mm'));

const getTotalTaskDuration = (tasks) => {
  const sumTime = tasks
    .map((t) => (t.start && t.end ? getDiffTime(t.start, t.end) : 0))
    .reduce((sum, time) => sum + time, 0);

  const spendTime = moment.utc(sumTime);
  return spendTime.format('HH:mm');
};

const DateTasks = () => {
  const classes = useStyles();

  const {t, i18n} = useTranslation();

  moment.locale(i18n.language);

  const [doneTasks] = useContext(DoneTaskContext);
  const [pendingTasks] = useContext(PendingTaskContext);
  const {setLoading, setCurrentDate, editTask} = useContext(AppContext);

  const [taskFormOpen, setTaskFormOpen] = useState(false);

  const {getTasksForDateAndSave} = useTaskApi();

  const query = useParams();
  const currentDate = moment(query.date);

  useEffect(() => {
    setLoading(true);
    const currentDate = moment(query.date);
    const newDate = currentDate.format('YYYY-MM-DD');
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
