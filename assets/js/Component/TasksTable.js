import React, {useContext} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MoreVertIccon from '@material-ui/icons/MoreVert';

import {AppContext} from '../_context/AppContext';
import {UPDATE_STATUS_TASK, useTaskProcessor} from '../_hook/useTaskProcessor';
import {taskHighlighter} from '../Common/Helper';
import WrapSkeletonOnLoading from '../_hoc/WrapSkeletonOnLoading';
import TaskRowItem from "./TaskRowItem";

const useStyles = makeStyles((theme) => ({
  listItem: {
    paddingRight: 95,
  },
  tag: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  table: {
    width: '100%'
  }
}));

const TasksTable = ({done, tasks}) => {
  const classes = useStyles();

  const {setOptionTask} = useContext(AppContext);

  const {processTask} = useTaskProcessor();

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="right">From</TableCell>
            <TableCell align="right">To</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map(task => <TaskRowItem done={done} task={task}/>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(TasksTable);
