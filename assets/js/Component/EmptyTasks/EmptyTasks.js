import React from 'react';

import {styled} from '@mui/material/styles';

import {useTranslation} from 'react-i18next';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {makeStyles} from '@mui/styles';

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import {colors} from '../../Common/Colors';

const PREFIX = 'EmptyTasks';

const classes = {
  noTasks: `${PREFIX}-noTasks`,
  icon: `${PREFIX}-icon`,
};

const StyledGrid = styled(Grid)(({theme}) => ({
  [`& .${classes.noTasks}`]: {
    textAlign: 'center',
  },

  [`& .${classes.icon}`]: {
    margin: `0 ${theme.spacing(1)}`,
    opacity: '0.3',
    fill: theme.palette.mode === 'dark' ? colors.gallery : colors.mineShaft,
  },
}));

const EmptyTasks = () => {
  const {t} = useTranslation();

  return (
    <StyledGrid container justifyContent="center" alignItems="center" direction="column">
      <Grid container item xs={8} justifyContent="center" alignItems="center">
        <PlaylistAddIcon fontSize="large" classes={{root: classes.icon}} />
        <Typography variant="overline" align="left" classes={{root: classes.noTasks}}>
          {t('table.noTasks')}
        </Typography>
      </Grid>
    </StyledGrid>
  );
};

export default EmptyTasks;
