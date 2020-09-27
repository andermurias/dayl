import React, {useContext} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';

import MoreVertIccon from '@material-ui/icons/MoreVert';

import moment from 'moment';

import {AppContext} from '../_context/AppContext';
import {UPDATE_STATUS_TASK, useTaskProcessor} from '../_hook/useTaskProcessor';
import {getDiffTime, taskHighlighter} from '../Common/Helper';
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

  const duration = task.start && task.end && moment.utc(getDiffTime(task.start, task.end)).format('HH:mm');

  return (
    <TableRow key={labelId} role="checkbox" hover>
      <TableCell padding="checkbox">
        <Checkbox edge="start" checked={done} onClick={() => processTask(UPDATE_STATUS_TASK, task)} tabIndex={-1} disableRipple inputProps={{'aria-labelledby': labelId}} />
      </TableCell>
      <TableCell align="left"  onClick={() => processTask(UPDATE_STATUS_TASK, task)}>
         <span
           dangerouslySetInnerHTML={{
             __html: taskHighlighter(task.description, classes.tag),
           }}
         />
      </TableCell>
      <TableCell align="right"  onClick={() => processTask(UPDATE_STATUS_TASK, task)}>
        <WrapSkeletonOnLoading>
          <span>{task.start || '-'}</span>
        </WrapSkeletonOnLoading>
        </TableCell>
      <TableCell align="right"  onClick={() => processTask(UPDATE_STATUS_TASK, task)}>
        <WrapSkeletonOnLoading>
          <span>{task.end || '-'}</span>
        </WrapSkeletonOnLoading>
        </TableCell>
      <TableCell align="right"  onClick={() => processTask(UPDATE_STATUS_TASK, task)}>
        <WrapSkeletonOnLoading>
          <span>{duration || '-'}</span>
        </WrapSkeletonOnLoading>
      </TableCell>
      <TableCell align="right">
        <IconButton edge="end" aria-label="option" onClick={() => setOptionTask(task)}>
          <WrapSkeletonOnLoading>
            <MoreVertIccon />
          </WrapSkeletonOnLoading>
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TaskListItem);
