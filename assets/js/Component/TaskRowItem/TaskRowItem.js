import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';

import PropTypes from 'prop-types';

import {makeStyles} from '@mui/styles';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Hidden from '@mui/material/Hidden';

import MoreVertIccon from '@mui/icons-material/MoreVert';

import {AppContext} from '../../_context/AppContext';
import {UPDATE_STATUS_TASK, useTaskProcessor} from '../../_hook/useTaskProcessor';
import {displayRemainingDays, getDeadlineData, getTaskDuration, taskHighlighter} from '../../Common/Helper';
import WrapSkeletonOnLoading from '../../_hoc/WrapSkeletonOnLoading';

import {task} from '../../_proptypes/task';
import {colors} from '../../Common/Colors';

const PREFIX = 'TaskRowItem';

const classes = {
  listItem: `${PREFIX}-listItem`,
  tag: `${PREFIX}-tag`,
  actionCell: `${PREFIX}-actionCell`,
  checkboxCell: `${PREFIX}-checkboxCell`,
  timeCell: `${PREFIX}-timeCell`,
  timeCellText: `${PREFIX}-timeCellText`,
  durationCell: `${PREFIX}-durationCell`,
  descriptionCell: `${PREFIX}-descriptionCell`,
  deadline: `${PREFIX}-deadline`,
  deadlineCellText: `${PREFIX}-deadlineCellText`,
  deadlineCell: `${PREFIX}-deadlineCell`,
  deadlineToday: `${PREFIX}-deadlineToday`,
  deadlineLate: `${PREFIX}-deadlineLate`,
  descriptionCellSubtitle: `${PREFIX}-descriptionCellSubtitle`,
  tableRow: `${PREFIX}-tableRow`,
};

const StyledTableRow = styled(TableRow)(({theme}) => ({
  [`& .${classes.listItem}`]: {
    paddingRight: 95,
  },

  [`& .${classes.tag}`]: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  [`& .${classes.actionCell}`]: {
    width: actionCellWidth,
    [theme.breakpoints.down('lg')]: {
      width: actionCellWidth / 2,
    },
  },

  [`& .${classes.checkboxCell}`]: {
    width: checkboxCellWidth,
    [theme.breakpoints.down('lg')]: {
      width: checkboxCellWidth / 2,
    },
  },

  [`& .${classes.timeCell}`]: {
    width: timeCellWidth,
  },

  [`& .${classes.timeCellText}`]: {
    opacity: 0.5,
  },

  [`& .${classes.durationCell}`]: {
    width: durationCellWidth,
  },

  [`& .${classes.descriptionCell}`]: {
    minHeight: 60.5,
    width: 'calc(100% - ' + getFixedCellsSize() + 'px)',
    [theme.breakpoints.down('lg')]: {
      width: 'auto',
    },
  },

  [`& .${classes.deadline}`]: {
    paddingTop: theme.spacing(1),
    opacity: '.5',
  },

  [`& .${classes.deadlineCellText}`]: {
    marginLeft: theme.spacing(1),
    opacity: '.5',
  },

  [`& .${classes.deadlineCell}`]: {
    width: deadlineCellWidth,
  },

  [`& .${classes.deadlineToday}`]: {
    color: colors.orangePeel,
    opacity: '1',
  },

  [`& .${classes.deadlineLate}`]: {
    color: colors.orangePeel,
    fontWeight: 'bold',
    opacity: '1',
  },

  [`& .${classes.descriptionCellSubtitle}`]: {
    opacity: '.5',
    paddingTop: theme.spacing(1),
  },

  [`&.${classes.tableRow}`]: {
    minHeight: 60.5,
  },
}));

const timeCellWidth = 125;
const durationCellWidth = 75;
const actionCellWidth = 70;
const checkboxCellWidth = 80;
const deadlineCellWidth = 110;

const getFixedCellsSize = () =>
  timeCellWidth * timeCellWidth + durationCellWidth + actionCellWidth + checkboxCellWidth + deadlineCellWidth;

const TaskRowItem = ({done, task, withActions}) => {
  const {t} = useTranslation();

  const labelId = `checkbox-list-label-${task.id}`;

  const {setOptionTask} = useContext(AppContext);

  const {processTask} = useTaskProcessor();

  const duration = getTaskDuration(task);

  const deadline = getDeadlineData(task);

  return (
    <StyledTableRow classes={{root: classes.tableRow}} role="checkbox" hover>
      {withActions && (
        <TableCell padding="checkbox" classes={{root: classes.checkboxCell}}>
          <WrapSkeletonOnLoading>
            <Checkbox
              color="secondary"
              edge="start"
              checked={done}
              onClick={() => processTask(UPDATE_STATUS_TASK, task)}
              tabIndex={-1}
              tabIndex={-1}
              disableRipple
              inputProps={{'aria-labelledby': labelId}}
            />
          </WrapSkeletonOnLoading>
        </TableCell>
      )}
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
      <Hidden mdDown>
        <TableCell
          align="right"
          classes={{root: classes.deadlineCell}}
          onClick={() => {
            withActions && processTask(UPDATE_STATUS_TASK, task);
          }}
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
          onClick={() => {
            withActions && processTask(UPDATE_STATUS_TASK, task);
          }}
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
          onClick={() => {
            withActions && processTask(UPDATE_STATUS_TASK, task);
          }}
        >
          <WrapSkeletonOnLoading>
            <Typography variant="body2">{duration || '-'}</Typography>
          </WrapSkeletonOnLoading>
        </TableCell>
      </Hidden>
      {withActions && (
        <TableCell align="right" classes={{root: classes.actionCell}}>
          <IconButton edge="end" aria-label="option" onClick={() => setOptionTask(task)} size="large">
            <WrapSkeletonOnLoading>
              <MoreVertIccon />
            </WrapSkeletonOnLoading>
          </IconButton>
        </TableCell>
      )}
    </StyledTableRow>
  );
};

TaskRowItem.propTypes = {
  done: PropTypes.bool,
  tasks: PropTypes.arrayOf(PropTypes.shape(task)),
  withActions: PropTypes.bool,
};

TaskRowItem.defaultProps = {
  withActions: true,
};

export default React.memo(TaskRowItem);
