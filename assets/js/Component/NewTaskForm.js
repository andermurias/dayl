import React, {useContext, useRef, useState} from "react";

import MomentUtils from "@date-io/moment";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import {MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";
import {makeStyles} from "@material-ui/core/styles";
import {addTask} from "../Api/Task";
import {DoneTaskContext} from "../_context/DoneTaskContext";
import {PendingTaskContext} from "../_context/PendingTaskContext";
import {getTasksForDate} from "../Common/Helper";
import {AppContext} from "../_context/AppContext";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
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

const NewTaskForm = () => {
  const classes = useStyles();

  const [, setDoneTasks] = useContext(DoneTaskContext);
  const [, setPendingTasks] = useContext(PendingTaskContext);
  const [context] = useContext(AppContext);

//  const defaultFormData = {
//    description: '',
//    start: null,
//    end: null,
//    date: null,
//  };

  const [startDate, handlestartDateChange] = useState(new Date());
  const [endDate, handleEndDateChange] = useState(new Date());
  const [description, setDescription] = useState('');
  const [done, setDone] = useState(false);



  let taskDescriptionRef = useRef(null);

  const updateTasks = () => {
    getTasksForDate(context.currentDate).then(([pending, done]) => {
      setPendingTasks(pending.data);
      setDoneTasks(done.data);
    });
  }

  const submitTask = () => {
    const start = moment(startDate).format('HH:mm');
    const end = moment(endDate).format('HH:mm');

    addTask({
      description: description,
      start: end === start ? null : start,
      end: end === start ? null : end,
      date: done ? context.currentDate : null,
    })
      .then(() => {
        taskDescriptionRef.current.value = '';
        updateTasks();
      })
  }

  const enterListenerSend = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      submitTask();
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid container item xs={12}>
          <TextField id="task-description" className={classes.inputText} label="Description" variant="outlined"
                     fullWidth
                     onChange={(e) => setDescription(e.target.value)}
                     onKeyPress={enterListenerSend}
                     inputRef={taskDescriptionRef}/>
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
                checked={done}
                onChange={(e) => setDone(event.target.checked)}
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
            onClick={submitTask}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>);
};

export default React.memo(NewTaskForm);