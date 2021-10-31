import React, {useState} from 'react';

import {styled} from '@mui/material/styles';

import moment from 'moment';

import {makeStyles} from '@mui/styles';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';

import SearchListItem from '../SearchListItem/SearchListItem';
import {colors} from '../../Common/Colors';

const PREFIX = 'SearchList';

const classes = {
  root: `${PREFIX}-root`,
  date: `${PREFIX}-date`,
};

const StyledList = styled(List)(({theme}) => ({
  [`&.${classes.root}`]: {
    width: '100%',
  },

  [`& .${classes.date}`]: {
    borderBottom: 'solid 1px ' + theme.palette.background.paper,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: colors.mineShaft,
  },
}));

const SearchList = ({tasks}) => {
  let listDate = null;

  return (
    <StyledList className={classes.root} subheader={<li />}>
      {tasks.map((task, i) => (
        <React.Fragment key={i}>
          {listDate !== task.date ? (
            <ListSubheader classes={{root: classes.date}}>
              <Typography variant="h5">
                {(listDate = task.date) && format(parse(listDate, 'yyyy-MM-dd', new Date()), 'P')}
              </Typography>
            </ListSubheader>
          ) : null}
          <SearchListItem task={task} />
        </React.Fragment>
      ))}
    </StyledList>
  );
};

export default React.memo(SearchList);
