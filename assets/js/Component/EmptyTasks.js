import React from 'react';

import {useTranslation} from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';

import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

import {colors} from '../Common/Colors';

const useStyles = makeStyles((theme) => ({
  noTasks: {
    textAlign: 'center',
  },
  icon: {
    margin: `0 ${theme.spacing(1)}px`,
    opacity: '0.3',
    fill: theme.palette.type === 'dark' ? colors.gallery : colors.mineShaft,
  },
}));

const EmptyTasks = () => {
  const classes = useStyles();
  const {t} = useTranslation();

  return (
    <Grid container justify="center" alignItems="center" direction="column">
      <Grid container item xs={8} justify="center" alignItems="center">
        <PlaylistAddIcon fontSize="large" classes={{root: classes.icon}} />
        <Typography variant="overline" align="left" classes={{root: classes.noTasks}}>
          {t('table.noTasks')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default EmptyTasks;
