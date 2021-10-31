import React from 'react';
import {styled} from '@mui/material/styles';
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

const PREFIX = 'TasksTable';

const classes = {
  listItem: `${PREFIX}-listItem`,
  tag: `${PREFIX}-tag`,
  table: `${PREFIX}-table`,
  tableHead: `${PREFIX}-tableHead`,
  tableHeadElement: `${PREFIX}-tableHeadElement`,
};

const StyledTableContainer = styled(TableContainer)(() => ({
  [`& .${classes.listItem}`]: {
    paddingRight: 95,
  },

  [`& .${classes.tag}`]: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  [`& .${classes.table}`]: {
    width: '100%',
  },

  [`& .${classes.tableHead}`]: {},

  [`& .${classes.tableHeadElement}`]: {
    opacity: '0.6',
  },
}));

const TasksTable = ({done, tasks, withActions}) => {
  const theme = useTheme();
  const isMdOrUp = useMediaQuery(theme.breakpoints.up('md'));

  return tasks.length ? (
    <StyledTableContainer>
      <Table className={classes.table} aria-label="simple table" size={isMdOrUp ? 'small' : 'medium'}>
        <TableBody>
          {tasks.map((task, i) => (
            <TaskRowItem done={done} task={task} key={i} withActions={withActions} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  ) : (
    <EmptyTasks />
  );
};

TasksTable.propTypes = {
  done: PropTypes.bool,
  tasks: PropTypes.arrayOf(PropTypes.shape(task)),
  withActions: PropTypes.bool,
};

TasksTable.defaultProps = {
  withActions: true,
};

export default React.memo(TasksTable);
