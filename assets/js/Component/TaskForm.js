import React, {useContext, useEffect, useRef, useState} from 'react';

import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core/styles';

import {MuiPickersUtilsProvider, TimePicker} from '@material-ui/pickers';

import AddCircleIcon from '@material-ui/icons/AddCircle';

import {useTaskApi} from '../_hook/useTaskApi';
import {UPDATE_TASK, ADD_TASK, useTaskProcessor} from '../_hook/useTaskProcessor';

import {AppContext} from '../_context/AppContext';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  form: {
    paddingBottom: `${theme.spacing(2)}px`,
  },
  description: {
    margin: `${theme.spacing(1)}px 0`,
    display: 'flex',
    flexGrow: 1,
    paddingLeft: `${theme.spacing(0.5)}px`,
  },
  checkboxParent: {
    padding: `${theme.spacing(1)}px`,
  },
  checkbox: {
    marginRight: `${theme.spacing(3)}px`,
    width: `${theme.spacing(5.25)}px`,
    height: `${theme.spacing(5.25)}px`,
  },
}));

const TaskForm = () => {
  const classes = useStyles();

  const {t} = useTranslation();
  const {processTask} = useTaskProcessor();

  const {currentDate, editTask, setEditTask, setLoading} = useContext(AppContext);

  const [startDate, handlestartDateChange] = useState(new Date());
  const [endDate, handleEndDateChange] = useState(new Date());
  const [description, setDescription] = useState('');
  const [done, setDone] = useState(false);
  const [id, setId] = useState('');

  const {getTasksForDateAndSave} = useTaskApi();

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

  const submitTask = async () => {
    setLoading(true);
    const start = moment(startDate).format('HH:mm');
    const end = moment(endDate).format('HH:mm');

    if (editTask) {
      await processTask(UPDATE_TASK, {
        id: editTask.id,
        description: description,
        start: end === start ? null : start,
        end: end === start ? null : end,
        date: done ? (editTask.date ? editTask.date : currentDate) : null,
      });
    } else {
      await processTask(ADD_TASK, {
        description: description,
        start: end === start ? null : start,
        end: end === start ? null : end,
        date: done ? currentDate : null,
      });
    }
    setEditTask(null);
    cleanForm();
  };

  const enterListenerSend = async (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      await submitTask();
    }
  };

  return (
    <>
      <Grid container spacing={2} className={classes.form}>
        <Grid container item xs={12} lg={7} justify="flex-start">
          <input type="hidden" ref={taskIdRef} value={id} />
          <div className={classes.description}>
            <Checkbox
              classes={{root: classes.checkboxParent}}
              checked={done}
              onChange={(e) => setDone(event.target.checked)}
              tabIndex={-1}
              disableRipple
              className={classes.checkbox}
            />
            <InputBase
              id="task-description"
              className={classes.inputText}
              placeholder={t('form.description')}
              variant="outlined"
              fullWidth
              onChange={(e) => setDescription(e.target.value)}
              onKeyPress={enterListenerSend}
              value={description}
              inputRef={taskDescriptionRef}
            />
          </div>
        </Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container item xs={5} lg={2}>
            <TimePicker
              inputVariant="outlined"
              id="task-start"
              label={t('form.start')}
              minutesStep={5}
              className={classes.inputText}
              ampm={false}
              value={startDate}
              onChange={handlestartDateChange}
              fullWidth
              autoOk
            />
          </Grid>
          <Grid container item xs={5} lg={2}>
            <TimePicker
              inputVariant="outlined"
              id="task-end"
              label={t('form.end')}
              minutesStep={5}
              className={classes.inputText}
              ampm={false}
              value={endDate}
              onChange={handleEndDateChange}
              fullWidth
              autoOk
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid container item xs={2} lg={1} justify="flex-end">
          <IconButton
            className={classes.inputText}
            variant="outlined"
            color="secondary"
            size="medium"
            onClick={submitTask}
          >
            <AddCircleIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(TaskForm);
