import React, {useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import {useTaskApi} from '../_hook/useTaskApi';

import {DoneTaskContext} from '../_context/DoneTaskContext';
import {PendingTaskContext} from '../_context/PendingTaskContext';
import {AppContext} from '../_context/AppContext';

import TaskListItem from '../Component/TaskListItem';
import TaskForm from '../Component/TaskForm';
import TaskListHeader from '../Component/TaskListHeader';

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
    maxWidth: 600,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
    backgroundColor: 'transparent',
  },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`,
    textTransform: 'uppercase',
  },
}));

const DateTasks = () => {
  const classes = useStyles();

  const {t, i18n} = useTranslation();

  moment.locale(i18n.language);

  const [doneTasks] = useContext(DoneTaskContext);
  const [pendingTasks] = useContext(PendingTaskContext);
  const {setLoading, setCurrentDate, editTask} = useContext(AppContext);

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

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <TaskListHeader currentDate={currentDate} />
        <Divider />
        <Typography className={classes.dividerFullWidth} display="block" variant="overline">
          {t('tasks.pending')} ({pendingTasks.length})
        </Typography>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <List className={classes.list}>
              {pendingTasks.map((task, i) => (
                <TaskListItem done={false} task={task} key={task.id} />
              ))}
            </List>
          </Grid>
        </Grid>
        <Divider />
        <Typography className={classes.dividerFullWidth} display="block" variant="overline">
          {t('tasks.done')} ({doneTasks.length})
        </Typography>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <List className={classes.list}>
              {doneTasks.map((task, i) => (
                <TaskListItem done={true} task={task} key={task.id} />
              ))}
            </List>
          </Grid>
        </Grid>
        <Divider />
        <Typography className={classes.dividerFullWidth} display="block" variant="overline">
          {editTask ? `${t('tasks.edit')} (${editTask.description})` : t('tasks.new')}
        </Typography>
        <TaskForm />
      </Paper>
    </div>
  );
};

export default React.memo(DateTasks);
