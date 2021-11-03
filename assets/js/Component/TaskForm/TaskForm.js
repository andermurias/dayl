import React, {useContext, useEffect, useRef, useState} from 'react';

import {styled} from '@mui/material/styles';

import {parse} from 'date-fns';
import {format} from '../../Common/Time';
import {useTranslation} from 'react-i18next';

import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import {makeStyles, useTheme} from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import TimePicker from '@mui/lab/TimePicker';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {UPDATE_TASK, ADD_TASK, useTaskProcessor} from '../../_hook/useTaskProcessor';

import {AppContext} from '../../_context/AppContext';

const PREFIX = 'TaskForm';

const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  description: `${PREFIX}-description`,
  checkboxParent: `${PREFIX}-checkboxParent`,
  checkbox: `${PREFIX}-checkbox`,
  sendButton: `${PREFIX}-sendButton`,
  buttonIcon: `${PREFIX}-buttonIcon`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`&.${classes.root}`]: {
    width: '100%',
  },

  [`& .${classes.form}`]: {
    paddingBottom: theme.spacing(2),
  },

  [`& .${classes.description}`]: {
    margin: `${theme.spacing(1)} 0`,
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
  },

  [`& .${classes.checkboxParent}`]: {
    width: `${theme.spacing(3)}!important`,
    height: `${theme.spacing(3)}!important`,
    padding: `0 ${theme.spacing(1.5)} 0 ${theme.spacing(2)}`,
  },

  [`& .${classes.checkbox}`]: {
    marginRight: theme.spacing(3.5),
    width: theme.spacing(5.25),
    height: theme.spacing(5.25),
  },

  [`& .${classes.sendButton}`]: {
    minWidth: '100%',
  },

  [`& .${classes.buttonIcon}`]: {
    marginLeft: theme.spacing(-0.5),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      marginLeft: 0,
      padding: 0,
    },
  },
}));

const TaskForm = () => {
  const theme = useTheme();

  const {t} = useTranslation();
  const {processTask} = useTaskProcessor();

  const {currentDate, editTask, setEditTask, setLoading} = useContext(AppContext);

  const [startDate, handleStartDateChange] = useState(new Date());
  const [endDate, handleEndDateChange] = useState(new Date());
  const [description, setDescription] = useState('');
  const [done, setDone] = useState(false);
  const [id, setId] = useState('');

  const isXSmallOrDown = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (editTask) {
      handleStartDateChange(editTask.start ? parse(editTask.start, 'HH:mm', new Date()) : new Date());
      handleEndDateChange(editTask.end ? parse(editTask.end, 'HH:mm', new Date()) : new Date());
      setDescription(editTask.description);
      setDone(!!editTask.date);
      setId(editTask.id);
    } else {
      cleanForm();
    }
  }, [editTask]);

  const cleanForm = () => {
    taskDescriptionRef.current.value = '';
    handleStartDateChange(new Date());
    handleEndDateChange(new Date());
    setDescription('');
    setDone(false);
    setId('');
  };

  let taskDescriptionRef = useRef(null);
  let taskIdRef = useRef('');

  const submitTask = async () => {
    setLoading(true);
    const start = format(startDate, 'HH:mm');
    const end = format(endDate, 'HH:mm');

    if (editTask && editTask.id) {
      await processTask(UPDATE_TASK, {
        ...editTask,
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
        deadline: editTask?.deadline || null,
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
    <StyledBox m={0} className={classes.root}>
      <Grid container spacing={2} className={classes.form}>
        <Grid container item xs={12} sm={12} md={7} justifyContent="flex-start">
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
        <Grid container item xs={6} sm={5} md={2}>
          <TimePicker
            id="task-start"
            label={t('form.start')}
            minutesStep={5}
            className={classes.inputText}
            ampm={false}
            value={startDate}
            onChange={handleStartDateChange}
            renderInput={(props) => <TextField {...props} />}
            fullWidth
            autoOk
          />
        </Grid>
        <Grid container item xs={6} sm={5} md={2}>
          <TimePicker
            id="task-end"
            label={t('form.end')}
            minutesStep={5}
            className={classes.inputText}
            ampm={false}
            value={endDate}
            onChange={handleEndDateChange}
            renderInput={(props) => <TextField {...props} />}
            fullWidth
            autoOk
          />
        </Grid>
        <Grid container item xs={12} sm={2} md={1}>
          <Button
            fullWidth
            disableElevation
            variant={!isXSmallOrDown ? 'contained' : 'outlined'}
            color="secondary"
            onClick={submitTask}
            size="large"
            classes={{endIcon: classes.buttonIcon, root: classes.sendButton}}
            endIcon={<ChevronRightIcon />}
          >
            {isXSmallOrDown ? (editTask ? t('form.edit') : t('form.save')) : ''}
          </Button>
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default React.memo(TaskForm);
