import React from 'react';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Link from '../../Atom/Link';

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: 'capitalize',
    textAlign: 'left',
    width: '100%',
  },
}));

const CalendarHeader = ({month}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmlOrDown = useMediaQuery(theme.breakpoints.down('sm'));

  const {t, i18n} = useTranslation();
  moment.locale(i18n.language);

  return (
    <Grid container spacing={3}>
      <Grid container item xs={6} sm={8}>
        <Typography variant="h2" component="h1" className={classes.title}>
          {isSmlOrDown ? month.nameShort : month.name}
        </Typography>
      </Grid>
      <Grid container item xs={6} sm={4} justify="flex-end">
        {month.pagination && (
          <>
            <IconButton aria-label="prev" component={Link} to={'/calendar/' + month.pagination.prev}>
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
            <IconButton aria-label="next" component={Link} to={'/calendar/' + month.pagination.next}>
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </>
        )}
      </Grid>
      <Grid container item xs={12}>
        <Typography variant="overline" component="h3">
          {t('calendar.amount').replace('%d', month.tasksTotal.toString()).replace('%s', month.name)}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default React.memo(CalendarHeader);
