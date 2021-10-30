import React, {useState} from 'react';

import moment from 'moment';

import {makeStyles} from '@mui/styles';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';

import SearchListItem from '../SearchListItem/SearchListItem';
import {colors} from '../../Common/Colors';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  date: {
    borderBottom: 'solid 1px ' + theme.palette.background.paper,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: colors.mineShaft,
  },
}));

const SearchList = ({tasks}) => {
  const classes = useStyles();
  let listDate = null;

  return (
    <List className={classes.root} subheader={<li />}>
      {tasks.map((task, i) => (
        <React.Fragment key={i}>
          {listDate !== task.date ? (
            <ListSubheader classes={{root: classes.date}}>
              <Typography variant="h5">{(listDate = task.date) && format(parse(listDate, 'yyyy-MM-dd', new Date()), 'P')}</Typography>
            </ListSubheader>
          ) : null}
          <SearchListItem task={task} />
        </React.Fragment>
      ))}
    </List>
  );
};

export default React.memo(SearchList);
