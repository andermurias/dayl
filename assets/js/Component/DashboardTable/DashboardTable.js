import React from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';

import {useTranslation} from 'react-i18next';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {makeStyles, useTheme} from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import TaskRowItem from '../TaskRowItem/TaskRowItem';
import EmptyTasks from '../EmptyTasks/EmptyTasks';

import {task} from '../../_proptypes/task';
import {TableCell, TableRow} from '@mui/material';

import {taskHighlighter} from '../../Common/Helper';
import {colors} from '../../Common/Colors';

const PREFIX = 'DashboardTable';

const classes = {
  listItem: `${PREFIX}-listItem`,
  tag: `${PREFIX}-tag`,
  table: `${PREFIX}-table`,
  tableHead: `${PREFIX}-tableHead`,
  tableHeadElement: `${PREFIX}-tableHeadElement`,
  tableTitle: `${PREFIX}-tableTitle`,
  tableRow: `${PREFIX}-tableRow`,
  tag: `${PREFIX}-tag`,
  descriptionCellSubtitle: `${PREFIX}-descriptionCellSubtitle`,
};

const StyledTableContainer = styled(TableContainer)(({theme}) => ({
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
  [`& .${classes.tableTitle}`]: {
    padding: theme.spacing(2),
    backgroundColor: colors.orangePeel,
    color: colors.mineShaft,
  },

  [`& .${classes.tableHeadElement}`]: {
    opacity: '0.6',
  },

  [`& .${classes.descriptionCellSubtitle}`]: {
    opacity: '.5',
  },

  [`& .${classes.tag}`]: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  [`& .${classes.tableRow}`]: {
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
  },
}));

const DashboardTable = ({tasks, title}) => {
  const theme = useTheme();
  const isMdOrUp = useMediaQuery(theme.breakpoints.up('md'));

  const {t} = useTranslation();

  return (
    <StyledTableContainer component={Paper}>
      <Typography variant="h6" gutterBottom component="div" className={classes.tableTitle}>
        {title}
      </Typography>
      <Table className={classes.table} aria-label="simple table" size={'medium'}>
        <TableBody>
          {tasks.length ? (
            tasks.map((task, i) => (
              <TableRow key={i} classes={{root: classes.tableRow}}>
                <TableCell>
                  <Typography
                    variant="body2"
                    dangerouslySetInnerHTML={{
                      __html: taskHighlighter(task.description, classes.tag),
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" classes={{root: classes.descriptionCellSubtitle}}>
                    {task.start && task.end && `${task.start} - ${task.end}`}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow classes={{root: classes.tableRow}}>
              <TableCell>
                <Typography variant="body2">{t('dashboard.empty')}</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

DashboardTable.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape(task)),
};

export default React.memo(DashboardTable);
