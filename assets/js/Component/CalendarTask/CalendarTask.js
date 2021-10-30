import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import makeStyles from '@mui/styles/makeStyles';

import {taskHighlighter} from '../../Common/Helper';

import {task} from '../../_proptypes/task';

const useStyles = makeStyles((theme) => ({
  taskChip: {
    display: 'inline-flex',
    marginTop: theme.spacing(1),
    maxWidth: '100%',
    border: 0,
  },
  tag: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
}));

const CalendarTask = ({task}) => {
  const classes = useStyles();

  return (
    <Chip
      size="small"
      color="secondary"
      classes={{root: classes.taskChip}}
      label={
        <Typography
          variant="inherit"
          dangerouslySetInnerHTML={{
            __html: taskHighlighter(task.description, classes.tag),
          }}
        />
      } />
  );
};

CalendarTask.propTypes = {
  task: PropTypes.shape(task),
};

export default React.memo(CalendarTask);
