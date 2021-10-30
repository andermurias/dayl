import React from 'react';
import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import {makeStyles, useTheme} from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import TaskRowItem from '../TaskRowItem/TaskRowItem';
import EmptyTasks from '../EmptyTasks/EmptyTasks';

import {task} from '../../_proptypes/task';

const useStyles = makeStyles(() => ({
  listItem: {
    paddingRight: 95,
  },
  tag: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  table: {
    width: '100%',
  },
  tableHead: {},
  tableHeadElement: {
    opacity: '0.6',
  },
}));

const TasksTable = ({done, tasks, withActions}) => {
  const classes = useStyles();

  const theme = useTheme();
  const isMdOrUp = useMediaQuery(theme.breakpoints.up('md'));

  return tasks.length ? (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table" size={isMdOrUp ? 'small' : 'medium'}>
        <TableBody>
          {tasks.map((task, i) => (
            <TaskRowItem done={done} task={task} key={i} withActions={withActions}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <EmptyTasks/>
  );
};

TasksTable.propTypes = {
  done: PropTypes.bool,
  tasks: PropTypes.arrayOf(PropTypes.shape(task)),
  withActions: PropTypes.bool
};

TasksTable.defaultProps = {
  withActions: true
};

export default React.memo(TasksTable);
