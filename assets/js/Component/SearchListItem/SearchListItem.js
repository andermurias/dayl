import React from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import {makeStyles} from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {taskHighlighter, getDiffTime} from '../../Common/Helper';

const useStyles = makeStyles((theme) => ({
  secondary: {
    opacity: '.5',
    paddingTop: theme.spacing(1),
  },
  tag: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
}));

const SearchListItem = ({task}) => {
  const classes = useStyles();

  const {i18n} = useTranslation();

  moment.locale(i18n.language);

  const timeDifference = moment(getDiffTime(task.start, task.end)).format('HH:mm');

  return (
    <ListItem button component={Link} to={'/tasks/' + moment(task.date).format('YYYY-MM-DD')}>
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
    </ListItem>
  );
};

export default React.memo(SearchListItem);
