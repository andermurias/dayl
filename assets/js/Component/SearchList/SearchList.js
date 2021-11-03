import React, {useState} from 'react';

import {styled} from '@mui/material/styles';

import {parseISO} from 'date-fns';
import {format} from '../../Common/Time';

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
  dividder: `${PREFIX}-divider`,
  title: `${PREFIX}-title`,
};

const StyledList = styled(List)(({theme}) => ({
  [`&.${classes.root}`]: {
    width: '100%',
  },

  [`& .${classes.title}`]: {
    position: 'relative',
  },

  [`& .${classes.title}::after`]: {
    content: '""',
    display: 'block',
    position: 'absolute',
    right: 0,
    top: '50%',
    height: '1px',
    backgroundColor: colors.orangePeel,
    width: 'calc(100% - 150px)',
  },

  [`& .${classes.date}`]: {
    // borderBottom: 'solid 1px ' + theme.palette.background.paper,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    backgroundColor: colors.mineShaft,
  },

  [`& .${classes.divider}`]: {},
}));

const SearchList = ({tasks}) => {
  let listDate = null;

  return (
    <StyledList className={classes.root} subheader={<li />}>
      {tasks.map((task, i) => (
        <React.Fragment key={i}>
          {listDate !== task.date ? (
            <ListSubheader classes={{root: classes.date}}>
              <Typography variant="h5" classes={{root: classes.title}}>
                {(listDate = task.date) && format(parseISO(listDate, new Date()), 'P')}
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
