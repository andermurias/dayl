import React from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import makeStyles from '@mui/styles/makeStyles';

import {taskHighlighter} from '../../Common/Helper';

import {task} from '../../_proptypes/task';

const PREFIX = 'CalendarTask';

const classes = {
  taskChip: `${PREFIX}-taskChip`,
  tag: `${PREFIX}-tag`,
  taskText: `${PREFIX}-taskText`,
};

const StyledChip = styled(Chip)(({theme}) => ({
  [`&.${classes.taskChip}`]: {
    display: 'inline-flex',
    marginTop: theme.spacing(1),
    maxWidth: '100%',
    border: 0,
  },

  [`& .${classes.taskText}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  [`& .${classes.tag}`]: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
}));

const CalendarTask = ({task}) => {
  return (
    <StyledChip
      size="small"
      color="secondary"
      classes={{root: classes.taskChip}}
      label={
        <Typography
          variant="inherit"
          classes={{root: classes.taskText}}
          dangerouslySetInnerHTML={{
            __html: taskHighlighter(task.description, classes.tag),
          }}
        />
      }
    />
  );
};

CalendarTask.propTypes = {
  task: PropTypes.shape(task),
};

export default React.memo(CalendarTask);
