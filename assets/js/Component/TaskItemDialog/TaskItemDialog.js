import React, {useContext, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useTranslation} from 'react-i18next';

import {format} from '../../Common/Time';

import {parseISO} from 'date-fns';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import {makeStyles} from '@mui/styles';
import {useTheme} from '@mui/material';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';

import MobileDatePicker from '@mui/lab/MobileDatePicker';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';

import {AppContext} from '../../_context/AppContext';
import {
  DELETE_TASK,
  EDIT_TASK,
  UPDATE_STATUS_TASK,
  DUPLICATE_TASK,
  UPDATE_TASK,
  DUPLICATE_EMPTY_TASK,
  useTaskProcessor,
} from '../../_hook/useTaskProcessor';
import {taskHighlighter} from '../../Common/Helper';
import {colors} from '../../Common/Colors';

const PREFIX = 'TaskItemDialog';

const classes = {
  tag: `${PREFIX}-tag`,
  dialogContainer: `${PREFIX}-dialogContainer`,
  dialogPaper: `${PREFIX}-dialogPaper`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  dialogContent: `${PREFIX}-dialogContent`,
  divider: `${PREFIX}-divider`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledDialog = styled(Dialog)(({theme}) => ({
  [`& .${classes.tag}`]: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  [`& .${classes.dialogContainer}`]: {
    alignItems: 'flex-end',
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
    },
  },

  [`& .${classes.dialogPaper}`]: {
    height: 'auto',
  },

  [`& .${classes.dialogTitle}`]: {
    backgroundColor: colors.orangePeel,
    color: colors.mineShaft,
  },

  [`& .${classes.dialogContent}`]: {
    padding: theme.spacing(0),
  },

  [`& .${classes.divider}`]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const UPDATE_DATE_TASK = 'update_date';
const UPDATE_DUE_DATE_TASK = 'update_due_date';

const createOption = ({icon, text, action, color, type}) => ({
  icon: icon,
  text: text,
  action: action,
  color: color || 'primary',
  type: type || 'item',
});

const createDivider = () => createOption({type: 'divider'});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TaskItemDialog = () => {
  const {t} = useTranslation();
  const theme = useTheme();

  const {setOptionTask, optionTask, editTask} = useContext(AppContext);

  const [endDatePickerStatus, setEndDatePickerStatus] = useState(false);
  const [deadlinePickerStatus, setDeadlinePickerStatus] = useState(false);

  const isSmallOrDown = useMediaQuery(theme.breakpoints.down('md'));

  const {processTask} = useTaskProcessor();

  const handleClose = () => {
    setOptionTask(null);
  };

  const options = [
    createOption({
      icon: editTask && editTask.id === optionTask?.id ? ClearIcon : EditIcon,
      text: editTask && editTask.id === optionTask?.id ? t('dialog.edit.cancel') : t('dialog.edit.enable'),
      action: EDIT_TASK,
    }),
    createDivider(),
    createOption({
      icon: optionTask?.date === null ? CheckBoxOutlinedIcon : CheckBoxOutlineBlankIcon,
      text: optionTask?.date === null ? t('dialog.status.done') : t('dialog.status.pending'),
      action: UPDATE_STATUS_TASK,
    }),
    createOption({
      icon: EventIcon,
      text: t('dialog.date'),
      action: UPDATE_DATE_TASK,
    }),
    createOption({
      icon: EventNoteIcon,
      text:
        optionTask && optionTask.deadline
          ? t('dialog.deadline.change') + ' (' + format(parseISO(optionTask.deadline, new Date()), 'P') + ')'
          : t('dialog.deadline.set'),
      action: UPDATE_DUE_DATE_TASK,
    }),
    createDivider(),
    createOption({
      icon: FileCopyOutlinedIcon,
      text: t('dialog.copy.empty'),
      action: DUPLICATE_EMPTY_TASK,
    }),
    createOption({
      icon: FileCopyIcon,
      text: t('dialog.copy.full'),
      action: DUPLICATE_TASK,
    }),
    createDivider(),
    createOption({
      icon: DeleteOutlineIcon,
      text: t('dialog.delete'),
      action: DELETE_TASK,
    }),
  ];

  const performAction = (action, task) => async () => {
    switch (action) {
      case UPDATE_DATE_TASK:
        setEndDatePickerStatus(true);
        break;
      case UPDATE_DUE_DATE_TASK:
        setDeadlinePickerStatus(true);
        break;
      default:
        setOptionTask(null);
        return await processTask(action, task);
    }
  };

  const performMoveTask = (date) => performAction(UPDATE_TASK, {...optionTask, date: format(date, 'yyyy-MM-dd')})();
  const performSetDeadline = (date) =>
    performAction(UPDATE_TASK, {...optionTask, deadline: date ? format(date, 'yyyy-MM-dd') : null})();

  return (
    <>
      <StyledDialog
        fullWidth={true}
        fullScreen={false}
        onClose={handleClose}
        open={optionTask !== null}
        aria-labelledby="task-option-dialog"
        TransitionComponent={Transition}
        classes={{
          container: classes.dialogContainer,
          paper: classes.dialogPaper,
        }}
      >
        <DialogTitle id="task-option-dialog" classes={{root: classes.dialogTitle}}>
          <Typography dangerouslySetInnerHTML={{__html: taskHighlighter(optionTask?.description, classes.tag)}} />
        </DialogTitle>
        <Divider />
        <DialogContent classes={{root: classes.dialogContent}}>
          <List>
            {(isSmallOrDown ? options.reverse() : options).map(({icon: Icon, text, action, color, type}, i) => {
              switch (type) {
                case 'divider':
                  return <Divider classes={{root: classes.divider}} key={i} />;
                  break;
                default:
                  return (
                    <ListItem button onClick={performAction(action, optionTask)} key={i}>
                      <ListItemIcon>
                        <Icon style={{color: color}} />
                      </ListItemIcon>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography type="body2" style={{color: color}}>
                            {text}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
              }
            })}
          </List>
        </DialogContent>
      </StyledDialog>
      <MobileDatePicker
        autoOk
        showTodayButton={true}
        todayText={t('tasks.today')}
        cancelText={t('tasks.cancel')}
        okText={t('tasks.ok')}
        clearText={t('tasks.clear')}
        open={deadlinePickerStatus}
        disableCloseOnSelect={false}
        onOpen={() => setDeadlinePickerStatus(true)}
        onAccept={() => setDeadlinePickerStatus(false)}
        onClose={() => setDeadlinePickerStatus(false)}
        onChange={performSetDeadline}
        clearable={true}
        renderInput={(props) => null}
      />
      <MobileDatePicker
        autoOk
        showTodayButton={true}
        todayText={t('tasks.today')}
        cancelText={t('tasks.cancel')}
        okText={t('tasks.ok')}
        open={endDatePickerStatus}
        disableCloseOnSelect={false}
        onOpen={() => setEndDatePickerStatus(true)}
        onAccept={() => setEndDatePickerStatus(false)}
        onClose={() => setEndDatePickerStatus(false)}
        onChange={performMoveTask}
        renderInput={(props) => null}
      />
    </>
  );
};

export default TaskItemDialog;
