import React, {useContext, useEffect, useRef, useState} from 'react';

import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import {MuiPickersUtilsProvider, TimePicker} from '@material-ui/pickers';

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';

import {useTaskApi} from '../_hook/useTaskApi';

import {AppContext} from '../_context/AppContext';
import {UPDATE_TASK, ADD_TASK, useTaskProcessor} from '../_hook/useTaskProcessor';

const useStyles = makeStyles((theme) => ({
  inputText: {
    marginTop: `${theme.spacing(2)}px`,
  },
  check: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: `${theme.spacing(2)}px`,
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
      <Grid container spacing={1}>
        <Grid container item xs={12}>
          <input type="hidden" ref={taskIdRef} value={id} />
          <TextField
            id="task-description"
            className={classes.inputText}
            label={t('form.description')}
            variant="outlined"
            fullWidth
            onChange={(e) => setDescription(e.target.value)}
            onKeyPress={enterListenerSend}
            value={description}
            inputRef={taskDescriptionRef}
          />
        </Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container item xs={4}>
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
          <Grid container item xs={4}>
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
        <Grid container item xs={4}>
          <FormControlLabel
            className={classes.check}
            control={
              <Switch checked={done} onChange={(e) => setDone(event.target.checked)} name="done" color="secondary" />
            }
            label={t('form.done')}
            labelPlacement="top"
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid container item xs={12}>
          <Button
            className={classes.inputText}
            variant="outlined"
            color="secondary"
            size="large"
            fullWidth
            startIcon={<CheckOutlinedIcon />}
            onClick={submitTask}
          >
            {editTask ? t('form.edit') : t('form.save')}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(TaskForm);
