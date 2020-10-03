import React, {useContext, useEffect, useRef, useState} from 'react';

import MomentUtils from '@date-io/moment';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {MuiPickersUtilsProvider, TimePicker} from '@material-ui/pickers';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {UPDATE_TASK, ADD_TASK, useTaskProcessor} from '../../_hook/useTaskProcessor';

import {AppContext} from '../../_context/AppContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  form: {
    paddingBottom: `${theme.spacing(2)}px`,
  },
  description: {
    margin: `${theme.spacing(1)}px 0`,
    display: 'flex',
    flexGrow: 1,
  },
  checkboxParent: {
    width: `${theme.spacing(3)}px!important`,
    padding: `0 ${theme.spacing(1.5)}px 0 ${theme.spacing(2)}px`,
  },
  checkbox: {
    marginRight: `${theme.spacing(3.5)}px`,
    width: `${theme.spacing(5.25)}px`,
    height: `${theme.spacing(5.25)}px`,
  },
  buttonIcon: {
    margin: 0,
  },
}));

const TaskForm = () => {
  const classes = useStyles();
  const theme = useTheme();

  const {t} = useTranslation();
  const {processTask} = useTaskProcessor();

  const {currentDate, editTask, setEditTask, setLoading} = useContext(AppContext);

  const [startDate, handlestartDateChange] = useState(new Date());
  const [endDate, handleEndDateChange] = useState(new Date());
  const [description, setDescription] = useState('');
  const [done, setDone] = useState(false);
  const [id, setId] = useState('');

  const isXSmallOrDown = useMediaQuery(theme.breakpoints.down('xs'));

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
    <Box m={0} className={classes.root}>
      <Grid container spacing={2} className={classes.form}>
        <Grid container item xs={12} sm={12} md={7} justify="flex-start">
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
          <Grid container item xs={6} sm={5} md={2}>
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
          <Grid container item xs={6} sm={5} md={2}>
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
        <Grid container item xs={12} sm={2} md={1}>
          <Button
            fullWidth
            disableElevation
            variant={!isXSmallOrDown ? 'contained' : 'outlined'}
            color="secondary"
            onClick={submitTask}
            size="large"
            classes={{endIcon: !isXSmallOrDown ? classes.buttonIcon : ''}}
            endIcon={<ChevronRightIcon />}
          >
            {isXSmallOrDown ? (editTask ? t('form.edit') : t('form.save')) : ''}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(TaskForm);
