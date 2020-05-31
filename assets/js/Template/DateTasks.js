import React, {useEffect, useState, useContext} from "react";
import {withRouter, useParams, Link, BrowserRouter as Router} from "react-router-dom";
import moment from 'moment';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TaskListItem from "../Component/TaskListItem";
import NewTaskForm from "../Component/NewTaskForm";

import {DoneTaskContext} from "../_context/DoneTaskContext";
import {PendingTaskContext} from "../_context/PendingTaskContext";
import {getTasksForDate} from "../Common/Helper";
import {AppContext} from "../_context/AppContext";
import ModalLoader from "../Component/ModalLoader";

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
  },
  title: {
    margin: `${theme.spacing(2)}px`,
    textTransform: 'capitalize',
    textAlign: 'center',
    width: '100%'
  },
  subtitle: {
    margin: `${theme.spacing(2)}px`,
    textTransform: 'capitalize',
    textAlign: "center",
    width: '100%'
  },
  titleSecondary: {
    opacity: '.3',
    fontWeight: 'regular'
  }
}));

const DateTasks = () => {
  const classes = useStyles();
  const [doneTasks, setDoneTasks] = useContext(DoneTaskContext);
  const [pendingTasks, setPendingTasks] = useContext(PendingTaskContext);
  const [context, setContext] = useContext(AppContext);

  const query = useParams();
  const currentDate = moment(query.date);

  const prevDate = moment(currentDate).subtract(1, 'day').format('YYYY-MM-DD');
  const nexDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');

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
        <Grid container spacing={1}>
          <Grid container item xs={2} sm={1}>
            <IconButton aria-label="prev" component={Link} to={'/tasks/' + prevDate}>
              <ChevronLeftIcon/>
            </IconButton>
          </Grid>
          <Grid container item xs={8} sm={10}>
            <Typography variant="h5" component="h1" className={classes.title}>
              {currentDate.format('dddd')} <br/> <span className={classes.titleSecondary}>({currentDate.format('LL')})</span>
            </Typography>
          </Grid>
          <Grid container item xs={2} sm={1}>
            <IconButton aria-label="next" component={Link} to={'/tasks/' + nexDate}>
              <ChevronRightIcon/>
            </IconButton>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <Typography variant="h6" component="h2" className={classes.subtitle} color='textSecondary' gutterBottom>
              {currentDate.format('[W: ] w')} | {currentDate.startOf('week').format('L')} - {currentDate.endOf('week').format('L')}
            </Typography>
          </Grid>
        </Grid>
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