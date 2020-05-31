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

export const NewTaskForm = ({currentDate}) => {
  const classes = useStyles();

  const defaultFormData = {
    description: '',
    start: null,
    end: null,
    date: null,
  };

  const [startDate, handlestartDateChange] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [endDate, handleEndDateChange] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [description, setDescription] = useState(defaultFormData);
  const [done, setDone] = useState(false);

  const [, setDoneTasks] = useContext(DoneTaskContext);
  const [, setPendingTasks] = useContext(PendingTaskContext);

  let taskDescriptionRef = useRef(null);

  const updateTasks = () => {
    getTasksForDate(currentDate).then(([pending, done]) => {
      setPendingTasks(pending.data);
      setDoneTasks(done.data);
    });
  }

  const submitTask = () => {
    addTask(formData).then(() => {
      taskDescriptionRef.current.value = '';
      updateTasks();
    })
  }

  const enterListenerSend = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      console.log({
        description: description,
        start: startDate,
        end: endDate,
        date: done ? currentDate : null,
      });
      return null;
      submitTask({
        description: description,
        start: startDate.format('HH:MM'),
        end: endDate.format('HH:MM'),
        date: done ? currentDate : null,
      })
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid container item xs={12}>
          <TextField id="task-description" className={classes.inputText} label="Description" variant="outlined"
                     fullWidth
                     onChange={setDescription}
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
                onChange={() => setDone(event.target.checked)}
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
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>);
}