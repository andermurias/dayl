import React from 'react';
import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import TaskRowItem from './TaskRowItem';

const useStyles = makeStyles((theme) => ({
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
  tableHead: {
    opacity: '0.6',
  },
  noTasks: {
    width: '100%',
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
        <Hidden smDown>
          <TableHead classes={{root: classes.tableHead}}>
            <TableRow>
              <TableCell> </TableCell>
              <TableCell align="left">
                <Typography variant="overline">{t('table.description')}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="overline">{t('table.from')}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="overline">{t('table.to')}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="overline">{t('table.duration')}</Typography>
              </TableCell>
              <TableCell align="right"> </TableCell>
            </TableRow>
          </TableHead>
        </Hidden>
        <TableBody>
          {tasks.map((task, i) => (
            <TaskRowItem done={done} task={task} key={i} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Typography variant="overline" align="center" classes={{root: classes.noTasks}}>
      {t('table.noTasks')}
    </Typography>
  );
};

TasksTable.propTypes = {
  done: PropTypes.bool,
  tasks: PropTypes.array,
};

export default React.memo(TasksTable);
