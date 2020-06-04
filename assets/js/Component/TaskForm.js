import React, {useContext, useEffect, useRef, useState} from "react";

import MomentUtils from "@date-io/moment";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import {MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";
import {makeStyles} from "@material-ui/core/styles";
import {addTask, updateTask} from "../Api/Task";
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

const TaskForm = () => {
  const classes = useStyles();

  const [, setDoneTasks] = useContext(DoneTaskContext);
  const [, setPendingTasks] = useContext(PendingTaskContext);
  const {currentDate, editTask, setEditTask} = useContext(AppContext);

  const [startDate, handlestartDateChange] = useState(new Date());
  const [endDate, handleEndDateChange] = useState(new Date());
  const [description, setDescription] = useState('');
  const [done, setDone] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    if (editTask) {
      handlestartDateChange(editTask.start ? new Date(moment(editTask.start, 'HH:mm').toDate()) : new Date());
      handleEndDateChange(editTask.end ? new Date(moment(editTask.end, 'HH:mm').toDate()) : new Date());
      setDescription(editTask.description);
      setDone(!!editTask.date);
      setId(editTask.id);
    } else {
      cleanForm();
    }
  }, [editTask]);

  const cleanForm = () => {
    taskDescriptionRef.current.value = '';
    handlestartDateChange(new Date());
    handleEndDateChange(new Date());
    setDescription('');
    setDone(false);
    setId('');
  };

  let taskDescriptionRef = useRef(null);
  let taskIdRef = useRef('');

  const updateTasks = () => {
    getTasksForDate(currentDate).then(([pending, done]) => {
      setPendingTasks(pending.data);
      setDoneTasks(done.data);
    });
  }

  const submitTask = () => {
    const start = moment(startDate).format('HH:mm');
    const end = moment(endDate).format('HH:mm');

    let request = null;
    if (editTask) {
      request = updateTask(editTask, {
        description: description,
        start: end === start ? null : start,
        end: end === start ? null : end,
        date: done ? (editTask.date ? editTask.date : currentDate) : null,
      })
    } else {
      request = addTask({
        description: description,
        start: end === start ? null : start,
        end: end === start ? null : end,
        date: done ? currentDate : null,
      })
    }

    if (request) {
      request.then(() => {
        setEditTask(null);
        cleanForm();
        updateTasks();
      })
    }
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
          <input type="hidden" ref={taskIdRef} value={id}/>
          <TextField id="task-description" className={classes.inputText} label="Description" variant="outlined"
                     fullWidth
                     onChange={(e) => setDescription(e.target.value)}
                     onKeyPress={enterListenerSend}
                     value={description}
                     inputRef={taskDescriptionRef}/>
        </Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container item xs={4}>
            <TimePicker
              inputVariant="outlined"
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
              inputVariant="outlined"
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
            {editTask ? 'Edit' : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(TaskForm);