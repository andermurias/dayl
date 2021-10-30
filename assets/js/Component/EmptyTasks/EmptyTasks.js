import React from 'react';

import {useTranslation} from 'react-i18next';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import {colors} from '../../Common/Colors';

const useStyles = makeStyles((theme) => ({
  noTasks: {
    textAlign: 'center',
  },
  icon: {
    margin: `0 ${theme.spacing(1)}`,
    opacity: '0.3',
    fill: theme.palette.mode === 'dark' ? colors.gallery : colors.mineShaft,
  },
}));

const EmptyTasks = () => {
  const classes = useStyles();
  const {t} = useTranslation();

  return (
    <Grid container justifyContent="center" alignItems="center" direction="column">
      <Grid container item xs={8} justifyContent="center" alignItems="center">
        <PlaylistAddIcon fontSize="large" classes={{root: classes.icon}} />
        <Typography variant="overline" align="left" classes={{root: classes.noTasks}}>
          {t('table.noTasks')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default EmptyTasks;
