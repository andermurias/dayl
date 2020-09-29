import React, {useEffect, useContext, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import {useTaskApi} from '../_hook/useTaskApi';

import {DoneTaskContext} from '../_context/DoneTaskContext';
import {PendingTaskContext} from '../_context/PendingTaskContext';
import {AppContext} from '../_context/AppContext';

import TaskForm from '../Component/TaskForm';
import TaskListHeader from '../Component/TaskListHeader';
import TaskItemDialog from '../Component/TaskItemDialog';

import TasksTable from '../Component/TasksTable';
import AccordionComponent from '../Component/AccordionComponent';

const useStyles = makeStyles((theme) => ({
  list: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 0),
  },
  paper: {
    maxWidth: 1000,
    margin: `${theme.spacing(1)}px auto`,
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
    <div className={classes.root}>
      <TaskListHeader currentDate={currentDate} />
      <Paper classes={{root: classes.paper}}>
        <AccordionComponent
          expanded={!!editTask || taskFormOpen}
          onChange={() => setTaskFormOpen(!taskFormOpen)}
          defaultExpanded={false}
          title={editTask ? t('tasks.edit') : t('tasks.new')}
        >
          <TaskForm />
        </AccordionComponent>
        <Divider />
        <AccordionComponent defaultExpanded={true} title={t('tasks.pending') + ' (' + pendingTasks.length + ')'}>
          <TasksTable tasks={pendingTasks} />
        </AccordionComponent>
        <Divider />
        <AccordionComponent
          defaultExpanded={true}
          title={t('tasks.done') + ' (' + doneTasks.length + ')'}
          sideTitle={spendTimeFormat}
        >
          <TasksTable done={true} tasks={doneTasks} />
        </AccordionComponent>
      </Paper>
      <TaskItemDialog />
    </div>
  );
};

export default React.memo(DateTasks);
