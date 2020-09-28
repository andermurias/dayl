import React, {useContext} from 'react';

import PropTypes from 'prop-types';

import moment from 'moment';

import {makeStyles} from '@material-ui/core/styles';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import MoreVertIccon from '@material-ui/icons/MoreVert';

import {AppContext} from '../_context/AppContext';
import {UPDATE_STATUS_TASK, useTaskProcessor} from '../_hook/useTaskProcessor';
import {getDiffTime, taskHighlighter} from '../Common/Helper';
import WrapSkeletonOnLoading from '../_hoc/WrapSkeletonOnLoading';

const timeCellWidth = 100;
const timeCellCount = 3;
const actionCellWidth = 80;
const actionCellCount = 1;
const checkboxCellWidth = 80;
const checkboxCellCount = 1;

const getFixedCellsSize = () =>
  timeCellWidth * timeCellCount + actionCellWidth * actionCellCount + checkboxCellWidth * checkboxCellCount;

const useStyles = makeStyles((theme) => ({
  listItem: {
    paddingRight: 95,
  },
  tag: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  actionCell: {
    width: actionCellWidth,
    [theme.breakpoints.down('md')]: {
      width: actionCellWidth / 2,
    },
  },
  checkboxCell: {
    width: checkboxCellWidth,
    [theme.breakpoints.down('md')]: {
      width: checkboxCellWidth / 2,
    },
  },
  timeCell: {
    width: timeCellWidth,
  },
  descriptionCell: {
    width: 'calc(100% - ' + getFixedCellsSize() + 'px)',
    [theme.breakpoints.down('md')]: {
      width: 'auto',
    },
  },
  descriptionCellSubtitle: {
    opacity: '.5',
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
      <TableCell padding="checkbox" classes={{root: classes.checkboxCell}}>
        <WrapSkeletonOnLoading>
          <Checkbox
            edge="start"
            checked={done}
            onClick={() => processTask(UPDATE_STATUS_TASK, task)}
            tabIndex={-1}
            disableRipple
            inputProps={{'aria-labelledby': labelId}}
          />
        </WrapSkeletonOnLoading>
      </TableCell>
      <TableCell
        align="left"
        classes={{root: classes.descriptionCell}}
        onClick={() => processTask(UPDATE_STATUS_TASK, task)}
      >
        <WrapSkeletonOnLoading>
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{
              __html: taskHighlighter(task.description, classes.tag),
            }}
          />
          <Hidden mdUp>
            <Typography variant="body2" classes={{root: classes.descriptionCellSubtitle}}>
              {task.start && task.end && task.start + ' - ' + task.end + ' (' + duration + ')'}
            </Typography>
          </Hidden>
        </WrapSkeletonOnLoading>
      </TableCell>
      <Hidden smDown>
        <TableCell
          align="right"
          classes={{root: classes.timeCell}}
          onClick={() => processTask(UPDATE_STATUS_TASK, task)}
        >
          <WrapSkeletonOnLoading>
            <Typography variant="body2">{task.start || '-'}</Typography>
          </WrapSkeletonOnLoading>
        </TableCell>
        <TableCell
          align="right"
          classes={{root: classes.timeCell}}
          onClick={() => processTask(UPDATE_STATUS_TASK, task)}
        >
          <WrapSkeletonOnLoading>
            <Typography variant="body2">{task.end || '-'}</Typography>
          </WrapSkeletonOnLoading>
        </TableCell>
        <TableCell
          align="right"
          classes={{root: classes.timeCell}}
          onClick={() => processTask(UPDATE_STATUS_TASK, task)}
        >
          <WrapSkeletonOnLoading>
            <Typography variant="body2">{duration || '-'}</Typography>
          </WrapSkeletonOnLoading>
        </TableCell>
      </Hidden>
      <TableCell align="right" classes={{root: classes.actionCell}}>
        <IconButton edge="end" aria-label="option" onClick={() => setOptionTask(task)}>
          <WrapSkeletonOnLoading>
            <MoreVertIccon />
          </WrapSkeletonOnLoading>
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

TaskListItem.propTypes = {
  done: PropTypes.bool,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      date: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
      id: PropTypes.number,
    }),
  ),
};

export default React.memo(TaskListItem);
