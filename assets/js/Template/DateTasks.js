import React, {useEffect, useContext} from "react";
import {withRouter, useParams} from "react-router-dom";
import moment from 'moment';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TaskListItem from "../Component/TaskListItem";
import NewTaskForm from "../Component/NewTaskForm";

import {DoneTaskContext} from "../_context/DoneTaskContext";
import {PendingTaskContext} from "../_context/PendingTaskContext";
import {getTasksForDate} from "../Common/Helper";
import {AppContext} from "../_context/AppContext";
import TaskListHeader from "../Component/TaskListHeader";

moment.locale('es');

const useStyles = makeStyles((theme) => ({
  list: {
    width: '100%',
    backgroundColor: 'transparent'
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
    backgroundColor: 'transparent'
  },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`,
    textTransform: 'uppercase'
  }
}));

const DateTasks = () => {
  const classes = useStyles();
  const [doneTasks, setDoneTasks] = useContext(DoneTaskContext);
  const [pendingTasks, setPendingTasks] = useContext(PendingTaskContext);
  const [context, setContext] = useContext(AppContext);

  const query = useParams();
  const currentDate = moment(query.date);

  useEffect(() => {
    setContext({currentDate: currentDate.format('YYYY-MM-DD')});
    setContext({loading: true});
    getTasksForDate(context.currentDate)
      .then(([pending, done]) => {
        setPendingTasks(pending.data);
        setDoneTasks(done.data);
        setContext({loading: false});
      });
  }, [query.date]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <TaskListHeader currentDate={currentDate} />
        <Divider/>
        <Typography className={classes.dividerFullWidth} display="block" variant="overline">
          Pending ({pendingTasks.length})
        </Typography>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <List className={classes.list}>
              {pendingTasks.map((task, i) => (
                <TaskListItem done={false} task={task} key={task.id}/>
              ))}
            </List>
          </Grid>
        </Grid>
        <Divider/>
        <Typography className={classes.dividerFullWidth} display="block" variant="overline">
          Done ({doneTasks.length})
        </Typography>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <List className={classes.list}>
              {doneTasks.map((task, i) => (
                <TaskListItem done={true} task={task} key={task.id}/>
              ))}
            </List>
          </Grid>
        </Grid>
        <Divider/>
        <Typography className={classes.dividerFullWidth} display="block" variant="overline">
          New Task
        </Typography>
        <NewTaskForm/>
      </Paper>
    </div>
  );
}

export default withRouter(React.memo(DateTasks));