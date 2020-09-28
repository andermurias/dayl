import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';

import MomentUtils from '@date-io/moment';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/core/styles';
import {useTheme} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EventIcon from '@material-ui/icons/Event';

import {AppContext} from '../_context/AppContext';
import {
  DELETE_TASK,
  EDIT_TASK,
  UPDATE_STATUS_TASK,
  DUPLICATE_TASK,
  UPDATE_TASK,
  DUPLICATE_EMPTY_TASK,
  useTaskProcessor,
} from '../_hook/useTaskProcessor';
import {taskHighlighter} from '../Common/Helper';
import {colors} from '../Common/Colors';

const UPDATE_DATE_TASK = 'update_date';

const createOption = ({icon, text, action, color}) => ({
  icon: icon,
  text: text,
  action: action,
  color: color || 'primary',
});

const useStyles = makeStyles((theme) => ({
  tag: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dialogContainer: {
    alignItems: 'flex-end',
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
    },
  },
  dialogPaper: {
    height: 'auto',
  },
  dialogTitle: {
    backgroundColor: colors.orangePeel,
    color: colors.mineShaft,
  },
  dialogContent: {
    padding: theme.spacing(1),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TaskItemDialog = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const classes = useStyles();

  const {setOptionTask, optionTask, editTask} = useContext(AppContext);

  const [pickerStatus, setPickerStatus] = useState(false);

  const isSmallOrDown = useMediaQuery(theme.breakpoints.down('sm'));

  const {processTask} = useTaskProcessor();

  const handleClose = () => {
    setOptionTask(null);
  };

  const options = [
    createOption({
      icon: editTask ? ClearIcon : EditIcon,
      text: editTask ? t('dialog.edit.cancel') : t('dialog.edit.enable'),
      action: EDIT_TASK,
    }),
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
      icon: FileCopyOutlinedIcon,
      text: t('dialog.copy.empty'),
      action: DUPLICATE_EMPTY_TASK,
    }),
    createOption({
      icon: FileCopyIcon,
      text: t('dialog.copy.full'),
      action: DUPLICATE_TASK,
    }),
    createOption({
      icon: DeleteOutlineIcon,
      text: t('dialog.delete'),
      action: DELETE_TASK,
    }),
  ];

  const performAction = (action, task) => async () => {
    switch (action) {
      case UPDATE_DATE_TASK:
        setPickerStatus(true);
        break;
      default:
        setOptionTask(null);
        return await processTask(action, task);
    }
  };

  const performMoveTask = (date) => performAction(UPDATE_TASK, {...optionTask, date: date.format('YYYY-MM-DD')})();

  return (
    <>
      <Dialog
        fullWidth={true}
        fullScreen={isSmallOrDown}
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
            {(isSmallOrDown ? options.reverse() : options).map(({icon: Icon, text, action, color}) => (
              <ListItem button onClick={performAction(action, optionTask)} key={action}>
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
            ))}
          </List>
        </DialogContent>
      </Dialog>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          autoOk
          label="Date Picker"
          showTodayButton={true}
          todayLabel={t('tasks.today')}
          cancelLabel={t('tasks.cancel')}
          okLabel={t('tasks.ok')}
          open={pickerStatus}
          onOpen={() => setPickerStatus(true)}
          onAccept={() => setPickerStatus(false)}
          onClose={() => setPickerStatus(false)}
          onChange={performMoveTask}
          TextFieldComponent={() => null}
        />
      </MuiPickersUtilsProvider>
    </>
  );
};

export default TaskItemDialog;
