import React, {useState} from 'react';

import moment from 'moment';

import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

import SearchListItem from '../Component/SearchListItem';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  date: {
    borderBottom: 'solid 1px ' + theme.palette.background.paper,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
              <Typography variant="h5">{(listDate = task.date) && moment(listDate).format('L')}</Typography>
            </ListSubheader>
          ) : null}
          <SearchListItem task={task} />
        </React.Fragment>
      ))}
    </List>
  );
};

export default React.memo(SearchList);
