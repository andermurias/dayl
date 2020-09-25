import React, {useContext} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

import MoreVertIccon from '@material-ui/icons/MoreVert';

import {AppContext} from '../_context/AppContext';
import {UPDATE_STATUS_TASK, useTaskProcessor} from '../_hook/useTaskProcessor';
import {taskHighlighter} from '../Common/Helper';
import WrapSkeletonOnLoading from '../_hoc/WrapSkeletonOnLoading';

const useStyles = makeStyles((theme) => ({
  listItem: {
    paddingRight: 95,
  },
  tag: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
}));

const TaskListItem = ({done, task}) => {
  const classes = useStyles();
  const labelId = `checkbox-list-label-${task.id}`;

  const {setOptionTask} = useContext(AppContext);

  const {processTask} = useTaskProcessor();

  return (
    <ListItem
      className={classes.listItem}
      role={undefined}
      dense
      button
      onClick={() => processTask(UPDATE_STATUS_TASK, task)}
    >
      <ListItemIcon>
        <WrapSkeletonOnLoading>
          <Checkbox edge="start" checked={done} tabIndex={-1} disableRipple inputProps={{'aria-labelledby': labelId}} />
        </WrapSkeletonOnLoading>
      </ListItemIcon>
      <ListItemText
        id={labelId}
        primary={
          <WrapSkeletonOnLoading>
            <span
              dangerouslySetInnerHTML={{
                __html: taskHighlighter(task.description, classes.tag),
              }}
            />
          </WrapSkeletonOnLoading>
        }
        secondary={
          <WrapSkeletonOnLoading>
            <span>{task.start ? task.start + ' - ' + task.end : ''}</span>
          </WrapSkeletonOnLoading>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="option" onClick={() => setOptionTask(task)}>
          <WrapSkeletonOnLoading>
            <MoreVertIccon />
          </WrapSkeletonOnLoading>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default React.memo(TaskListItem);
