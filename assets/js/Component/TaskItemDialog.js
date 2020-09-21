import React, {useContext} from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import {makeStyles} from '@material-ui/core/styles';

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import {useTranslation} from 'react-i18next';
import {AppContext} from '../_context/AppContext';
import {DELETE_TASK, EDIT_TASK, UPDATE_STATUS_TASK, DUPLICATE_TASK, useTaskProcessor} from '../_hook/useTaskProcessor';
import {useTheme} from '@material-ui/core';
import {taskHighlighter} from '../Common/Helper';
import {colors} from '../Common/Colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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

  const isSmallOrDown = useMediaQuery(theme.breakpoints.down('sm'));

  const {setOptionTask, optionTask, editTask} = useContext(AppContext);
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
      text: optionTask?.date === null ? t('dialog.status.pending') : t('dialog.status.done'),
      action: UPDATE_STATUS_TASK,
    }),
    createOption({
      icon: FileCopyIcon,
      text: t('dialog.copy'),
      action: DUPLICATE_TASK,
    }),
    createOption({
      icon: DeleteOutlineIcon,
      text: t('dialog.delete'),
      action: DELETE_TASK,
    }),
  ];

  const performAction = (action, task) => async () => {
    setOptionTask(null);
    return await processTask(action, task);
  };

  return (
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
                    {' '}
                    {text}{' '}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      {/*<DialogActions>*/}
      {/*  <Button onClick={handleClose}>*/}
      {/*    {t('Close')}*/}
      {/*  </Button>*/}
      {/*</DialogActions>*/}
    </Dialog>
  );
};

export default TaskItemDialog;
