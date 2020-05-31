import React, {useEffect, useState, useContext} from "react";
import {withRouter, useParams, Link} from "react-router-dom";
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
import {TaskListItem} from "../Component/TaskListItem";
import {NewTaskForm} from "../Component/NewTaskForm";

import {DoneTaskContext} from "../_context/DoneTaskContext";
import {PendingTaskContext} from "../_context/PendingTaskContext";
import {getTasksForDate} from "../Common/Helper";

moment.locale('es');

const useStyles = makeStyles((theme) => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
  },
  paper: {
    maxWidth: 600,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
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
    textTransform: 'capitalize'
  },
  titleSecondary: {
    opacity: '.3',
    fontWeight: 'regular'
  }
}));

const DateTasks = () => {
  const classes = useStyles();
  const [update, updateState] = useState();
  const upd = () => updateState(Math.random());
  const [doneTasks, setDoneTasks] = useContext(DoneTaskContext);
  const [pendingTasks, setPendingTasks] = useContext(PendingTaskContext);

  const query = useParams();

  const currentDate = moment(query.date);
  const currentDateFormatted = currentDate.format('YYYY-MM-DD');

  const prevDate = moment(currentDate).subtract(1, 'day').format('YYYY-MM-DD');
  const nexDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');

  useEffect(() => {
    getTasksForDate(currentDateFormatted)
      .then(([pending, done]) => {
        setPendingTasks(pending.data);
        setDoneTasks(done.data);
      });
  }, [update, currentDateFormatted]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <Grid container spacing={1}>
          <Grid container item xs={1}>
            <IconButton aria-label="prev" component={Link}
                        to={'/tasks/' + prevDate}>
              <ChevronLeftIcon/>
            </IconButton>
          </Grid>
          <Grid container item xs={10}>
            <Typography variant="h5" component="h1" className={classes.title}>
              {currentDate.format('dddd')}
              <span className={classes.titleSecondary}> ({currentDate.format('LL')})</span>
            </Typography>
          </Grid>
          <Grid container item xs={1}>
            <IconButton aria-label="next" component={Link}
                        to={'/tasks/' + nexDate}>
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
        <Typography className={classes.dividerFullWidth}
                    display="block"
                    variant="overline">Pending ({pendingTasks.length})</Typography>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <List className={classes.list}>
              {pendingTasks.map((task, i) => (
                <TaskListItem done={false} currentDate={currentDateFormatted} task={task} key={task.id}/>
              ))}
            </List>
          </Grid>
        </Grid>
        <Divider/>

        <Typography className={classes.dividerFullWidth}
                    display="block"
                    variant="overline"
        >Done ({doneTasks.length})</Typography>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <List className={classes.list}>
              {doneTasks.map((task, i) => (
                <TaskListItem done={true} currentDate={currentDateFormatted} task={task} key={task.id}/>
              ))}
            </List>
          </Grid>
        </Grid>
        <Divider/>
        <Typography className={classes.dividerFullWidth}
                    display="block"
                    variant="overline"
        >New Task</Typography>
        <NewTaskForm upd={upd}/>
      </Paper>
    </div>
  );
}

export default withRouter(DateTasks);