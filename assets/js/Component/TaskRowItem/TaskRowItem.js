import React, {useContext} from 'react';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';

import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import MoreVertIccon from '@material-ui/icons/MoreVert';

import {AppContext} from '../../_context/AppContext';
import {UPDATE_STATUS_TASK, useTaskProcessor} from '../../_hook/useTaskProcessor';
import {displayRemainingDays, getDeadlineData, getTaskDuration, taskHighlighter} from '../../Common/Helper';
import WrapSkeletonOnLoading from '../../_hoc/WrapSkeletonOnLoading';

import {task} from '../../_proptypes/task';
import {colors} from '../../Common/Colors';

const timeCellWidth = 125;
const durationCellWidth = 75;
const actionCellWidth = 70;
const checkboxCellWidth = 80;
const deadlineCellWidth = 110;

const getFixedCellsSize = () =>
  timeCellWidth * timeCellWidth + durationCellWidth + actionCellWidth + checkboxCellWidth + deadlineCellWidth;

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
  timeCellText: {
    opacity: 0.5,
  },
  durationCell: {
    width: durationCellWidth,
  },
  descriptionCell: {
    width: 'calc(100% - ' + getFixedCellsSize() + 'px)',
    [theme.breakpoints.down('md')]: {
      width: 'auto',
    },
  },
  deadline: {
    paddingTop: theme.spacing(1),
    opacity: '.5',
  },
  deadlineCellText: {
    marginLeft: theme.spacing(1),
    opacity: '.5',
  },
  deadlineCell: {
    width: deadlineCellWidth,
  },
  deadlineToday: {
    color: colors.orangePeel,
    opacity: '1',
  },
  deadlineLate: {
    color: colors.orangePeel,
    fontWeight: 'bold',
    opacity: '1',
  },
  descriptionCellSubtitle: {
    opacity: '.5',
    paddingTop: theme.spacing(1),
  },
}));

const TaskListItem = ({done, task}) => {
  const classes = useStyles();
  const {t} = useTranslation();

  const labelId = `checkbox-list-label-${task.id}`;

  const {setOptionTask} = useContext(AppContext);

  const {processTask} = useTaskProcessor();

  const duration = getTaskDuration(task);

  const deadline = getDeadlineData(task);

  return (
    <TableRow role="checkbox" hover>
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
            {displayRemainingDays(task) && (
              <Typography
                variant="body2"
                classes={{
                  root: classNames(
                    classes.deadline,
                    {[classes.deadlineToday]: !task.date && deadline.remaining === 0},
                    {[classes.deadlineLate]: deadline.remaining < 0},
                  ),
                }}
              >
                {deadline.remaining + ' ' + t('tasks.remaining')}
              </Typography>
            )}
            <Typography variant="body2" classes={{root: classes.descriptionCellSubtitle}}>
              {task.start && task.end && task.start + ' - ' + task.end + ' (' + duration + ')'}
            </Typography>
          </Hidden>
        </WrapSkeletonOnLoading>
      </TableCell>
      <Hidden smDown>
        <TableCell
          align="right"
          classes={{root: classes.deadlineCell}}
          onClick={() => processTask(UPDATE_STATUS_TASK, task)}
        >
          <WrapSkeletonOnLoading>
            {displayRemainingDays(task) && (
              <>
                <Typography
                  variant="h6"
                  display="inline"
                  classes={{
                    root: classNames(
                      {[classes.deadlineToday]: !task.date && deadline.remaining === 0},
                      {[classes.deadlineLate]: deadline.remaining < 0},
                    ),
                  }}
                >
                  {deadline.remaining}
                </Typography>
                <Typography
                  variant="body2"
                  display="inline"
                  classes={{
                    root: classNames(
                      classes.deadlineCellText,
                      {[classes.deadlineToday]: !task.date && deadline.remaining === 0},
                      {[classes.deadlineLate]: deadline.remaining < 0},
                    ),
                  }}
                >
                  {Math.abs(deadline.remaining) === 1 ? t('tasks.day') : t('tasks.days')}
                </Typography>
              </>
            )}
          </WrapSkeletonOnLoading>
        </TableCell>
        <TableCell
          align="right"
          classes={{root: classes.timeCell}}
          onClick={() => processTask(UPDATE_STATUS_TASK, task)}
        >
          <WrapSkeletonOnLoading>
            <Typography variant="body2" classes={{root: classes.timeCellText}}>
              {(task.start && task.start + ' - ' + task.end) || '-'}
            </Typography>
          </WrapSkeletonOnLoading>
        </TableCell>
        <TableCell
          align="right"
          classes={{root: classes.durationCell}}
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
  tasks: PropTypes.arrayOf(PropTypes.shape(task)),
};

export default React.memo(TaskListItem);
