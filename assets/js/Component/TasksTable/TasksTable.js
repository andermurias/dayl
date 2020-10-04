import React from 'react';
import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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

const TasksTable = ({done, tasks}) => {
  const classes = useStyles();
  const {t} = useTranslation();

  const theme = useTheme();
  const isMdOrUp = useMediaQuery(theme.breakpoints.up('md'));

  return tasks.length ? (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table" size={isMdOrUp ? 'small' : 'medium'}>
        <TableBody>
          {tasks.map((task, i) => (
            <TaskRowItem done={done} task={task} key={i} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <EmptyTasks />
  );
};

TasksTable.propTypes = {
  done: PropTypes.bool,
  tasks: PropTypes.arrayOf(PropTypes.shape(task)),
};

export default React.memo(TasksTable);
