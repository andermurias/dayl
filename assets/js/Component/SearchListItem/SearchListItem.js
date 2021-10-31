import React from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import {makeStyles} from '@mui/styles';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import {taskHighlighter, getDiffTime} from '../../Common/Helper';

import {task} from '../../_proptypes/task';

const PREFIX = 'SearchListItem';

const classes = {
  secondary: `${PREFIX}-secondary`,
  tag: `${PREFIX}-tag`,
  listItem: `${PREFIX}-listItem`,
};

const StyledListItem = styled(ListItem)(({theme}) => ({
  [`& .${classes.secondary}`]: {
    opacity: '.5',
    paddingTop: theme.spacing(1),
  },

  [`& .${classes.tag}`]: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  [`& .${classes.listItem}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

const SearchListItem = ({task}) => {
  const {i18n} = useTranslation();

  const timeDifference = getDiffTime(task.start, task.end);

  return (
    <StyledListItem
      button
      component={Link}
      to={'/tasks/' + format(parse(task.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')}
    >
      <ListItemText
        classes={{root: classes.listItem}}
        primary={
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{
              __html: taskHighlighter(task.description, classes.tag),
            }}
          />
        }
        secondary={
          <Typography variant="body2" classes={{root: classes.secondary}}>
            {task.start && task.end && task.start + ' - ' + task.end + ' (' + timeDifference + ')'}
          </Typography>
        }
      />
    </StyledListItem>
  );
};

SearchListItem.propTypes = {
  task: PropTypes.shape(task),
};

export default React.memo(SearchListItem);
