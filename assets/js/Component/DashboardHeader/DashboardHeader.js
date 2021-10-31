import React from 'react';

import {styled} from '@mui/material/styles';

import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames/bind';

import moment from 'moment';
import {parse} from 'date-fns';
import {format, endOfWeek, startOfWeek} from '../../Common/Time';

import Box from '@mui/material/Box';
import Hidden from '@mui/material/Hidden';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {makeStyles, useTheme} from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';

import {useTaskApi} from '../../_hook/useTaskApi';

const PREFIX = 'DashboardHeader';

const classes = {
  title: `${PREFIX}-title`,
  subtitle: `${PREFIX}-subtitle`,
  left: `${PREFIX}-left`,
  right: `${PREFIX}-right`,
  titleSecondary: `${PREFIX}-titleSecondary`,
  datePicker: `${PREFIX}-datePicker`,
  paper: `${PREFIX}-paper`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
  [`& .${classes.title}`]: {
    textTransform: 'capitalize',
    textAlign: 'left',
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
  },

  [`& .${classes.subtitle}`]: {
    width: '100%',
    textTransform: 'uppercase',
    lineHeight: 1.5,
    '&:hover': {
      cursor: 'pointer',
    },
  },

  [`& .${classes.left}`]: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'left',
    },
  },

  [`& .${classes.right}`]: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'right',
    },
  },

  [`& .${classes.titleSecondary}`]: {
    opacity: '.3',
    fontWeight: 'regular',
  },

  [`& .${classes.datePicker}`]: {
    display: 'none',
  },

  [`&.${classes.paper}`]: {
    width: '100%',
    padding: `${theme.spacing(3)} ${theme.spacing(3)}`,
    background: 'transparent',
  },
}));

const DashboardHeader = ({currentDate}) => {
  const theme = useTheme();
  const isSmallOrUp = useMediaQuery(theme.breakpoints.up('sm'));

  const {t} = useTranslation();

  return (
    <StyledPaper className={classes.paper} elevation={0}>
      <Grid container spacing={1}>
        <Grid container item xs={12}>
          <Typography variant="h2" component="h1" className={classes.title}>
            {t('dashboard.hello')}
          </Typography>
        </Grid>
        <Grid container item xs={12} alignItems="center">
          <Typography variant="h6" component="h2" className={classes.title}>
            <span className={classes.titleSecondary}>
              {t('dashboard.date', {date: format(currentDate, isSmallOrUp ? 'PP' : 'P')})}
            </span>
          </Typography>
        </Grid>
      </Grid>
      <Hidden smDown>
        <Box my={2}>
          <Grid container spacing={1}>
            <Grid container item sm={6} xs={12}>
              <Typography variant="overline" component="h3" className={classNames(classes.subtitle, classes.left)}>
                {t('tasks.header.week')} {format(currentDate, 'w')}
              </Typography>
            </Grid>
            <Grid container item sm={6} xs={12}>
              <Typography variant="overline" component="h3" className={classNames(classes.subtitle, classes.right)}>
                {format(startOfWeek(currentDate), 'P')} - {format(endOfWeek(currentDate), 'P')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Hidden>
    </StyledPaper>
  );
};

DashboardHeader.propTypes = {
  currentDate: PropTypes.objectOf(moment),
};

export default React.memo(DashboardHeader);
