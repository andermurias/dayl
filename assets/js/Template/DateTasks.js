import React, {useEffect, useRef, useState} from "react";
import {withRouter, useParams, Link} from "react-router-dom";
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
import Button from '@material-ui/core/Button';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {MuiPickersUtilsProvider, TimePicker} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';

moment.locale('es');

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
  },
  inputText: {
    marginTop: `${theme.spacing(2)}px`,
  },
  check: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: `${theme.spacing(2)}px`
  }
}));

const DateTasks = ({date, location}) => {
  const classes = useStyles();
  const [update, updateState] = useState();
  const upd = () => updateState(Math.random());
  const [doneTasks, setDoneTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [startDate, handlestartDateChange] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [endDate, handleEndDateChange] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

  let tastDescriptionRef = useRef(null);

  const query = useParams();

  const currentDate = moment(query.date);
  const currentDateFormatted = currentDate.format('YYYY-MM-DD');

  const prevDate = moment(currentDate).subtract(1, 'day').format('YYYY-MM-DD');
  const nexDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');

  console.log(currentDate);

  useEffect(() => {
    getTasks('pending', query.date).then(res => setPendingTasks(res.data));
    getTasks('done', query.date).then(res => setDoneTasks(res.data));
  }, [update, currentDateFormatted]);

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
        <ListItemText id={labelId} primary={task.description}
                      secondary={task.start ? (task.start + ' - ' + task.end) : ''}/>
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={deleteTasks(task)}>
            <DeleteOutlineIcon/>
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
          <Grid container item xs={1}>
            <IconButton aria-label="prev" component={Link}
                        to={'/tasks/' + prevDate}>
              <ChevronLeftIcon/>
            </IconButton>
          </Grid>
          <Grid container item xs={10}>
            <Typography variant="h5" component="h1" className={classes.title}>{currentDate.format('dddd')}<span
              className={classes.titleSecondary}> ({currentDate.format('LL')})</span></Typography>
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
              {pendingTasks.map(renderListItem({done: false, currentDate: currentDateFormatted}))}
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
              {doneTasks.map(renderListItem({done: true, currentDate: null}))}
            </List>
          </Grid>
        </Grid>
        <Divider/>
        <Typography className={classes.dividerFullWidth}
                    display="block"
                    variant="overline"
        >New Task</Typography>

        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <TextField id="task-description" className={classes.inputText} label="Description" variant="outlined"
                       fullWidth
                       onKeyPress={enterListenerSend}
                       inputRef={tastDescriptionRef}/>
          </Grid>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid container item xs={4}>
              <TimePicker
                inputVariant='outlined'
                id="task-start"
                label="Start"
                minutesStep={5}
                className={classes.inputText}
                ampm={false}
                value={startDate}
                onChange={handlestartDateChange}
                fullWidth
              />
            </Grid>
            <Grid container item xs={4}>
              <TimePicker
                inputVariant='outlined'
                id="task-end"
                label="End"
                minutesStep={5}
                className={classes.inputText}
                ampm={false}
                value={endDate}
                onChange={handleEndDateChange}
                fullWidth
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <Grid container item xs={4}>
            <FormControlLabel
              className={classes.check}
              control={
                <Switch
                  checked={true}
                  onChange={() => {
                  }}
                  name="Done"
                  color="secondary"
                />
              }
              label="Done"
            />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <Button
              className={classes.inputText}
              variant="outlined"
              color="secondary"
              size='large'
              fullWidth
              startIcon={<CheckOutlinedIcon/>}
            >Save</Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default withRouter(DateTasks);