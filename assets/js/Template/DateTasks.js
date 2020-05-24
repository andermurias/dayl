import React, {useEffect, useRef, useState} from "react";
import {withRouter, useParams} from "react-router-dom";
import axios from "axios";
import moment from 'moment';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

moment.locale('es');         // es

const getTasks = (type, date) => {
  return axios.get(
    process.env.API_URL + '/api/task/' + type + (date ? '?date=' + date : ''),
    {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    })

}

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
    textTransform: 'capitalize'
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

const DateTasks = ({date, location}) => {
  const classes = useStyles();
  const [update, updateState] = useState();
  const upd = () => updateState(Math.random());
  const [doneTasks, setDoneTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  let tastDescriptionRef = useRef(null);

  const query = useParams();

  const currentDate = moment(query.date);
  const currentDateFormatted = currentDate.format('YYYY-MM-DD');

  useEffect(() => {
    getTasks('pending', query.date).then(res => setPendingTasks(res.data));
    getTasks('done', query.date).then(res => setDoneTasks(res.data));
  }, [update]);

  const changeTaskStatus = (task, date) => (e) => {
    axios.post(
      process.env.API_URL + '/api/task/' + task.id,
      {
        date: date
      },
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }
      }).then(() => {
      console.log('Updated Successfully!');
      upd();
    })
  }

  const deleteTasks = (task) => (e) => {
    axios.get(
      process.env.API_URL + '/api/task/delete/' + task.id,
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }
      }).then(() => {
      console.log('Delete Successfully!');
      upd();
    })
  }

  const renderListItem = ({done, currentDate}) => (task, i) => {
    const labelId = `checkbox-list-label-${task.id}`;

    return (
      <ListItem key={task.id} role={undefined} dense button onClick={changeTaskStatus(task, currentDate)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={done}
            tabIndex={-1}
            disableRipple
            inputProps={{'aria-labelledby': labelId}}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={task.description}/>
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={deleteTasks(task)}>
            <DeleteOutlineIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  const submitTask = (description) => {
    axios.post(
      process.env.API_URL + '/api/task/add',
      {
        description: description
      },
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }
      }).then(() => {
      tastDescriptionRef.current.value = '';
      upd();
    })
  }

  const enterListenerSend = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      submitTask(ev.target.value)
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <Typography variant="h4" component="h1" className={classes.title}>{currentDate.format('dddd')}<span
              className={classes.titleSecondary}> ({currentDate.format('LL')})</span></Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <Typography variant="h6" component="h2" className={classes.subtitle} color='textSecondary' gutterBottom>
              {currentDate.format('[W: ] W')} | {currentDate.startOf('week').format('L')} - {currentDate.endOf('week').format('L')}
            </Typography>
          </Grid>
        </Grid>
        <Divider/>

        <Typography className={classes.dividerFullWidth}
                    display="block"
                    variant="overline">Pending</Typography>

        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <List className={classes.list}>
              {pendingTasks.map(renderListItem({done: false, currentDate: currentDateFormatted}))
              }
            </List>
          </Grid>
        </Grid>
        <Divider/>

        <Typography className={classes.dividerFullWidth}
                    display="block"
                    variant="overline"
        >Done</Typography>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <List className={classes.list}>
              {doneTasks.map(renderListItem({done: true, currentDate: null}))}
            </List>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <TextField id="task-new" label="New Task" variant="outlined" fullWidth onKeyPress={enterListenerSend} ref={tastDescriptionRef}/>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default withRouter(DateTasks);