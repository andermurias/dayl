import React from 'react';

import {styled} from '@mui/material/styles';

import {makeStyles, useTheme} from '@mui/styles';
import Grid from '@mui/material/Grid';

import logo from '../../../static/img/logo/dayl_logo_full.svg';
import logoDark from '../../../static/img/logo/dayl_logo_full_dark.svg';

const PREFIX = 'Footer';

const classes = {
  logoContainer: `${PREFIX}-logoContainer`,
  logo: `${PREFIX}-logo`,
  root: `${PREFIX}-root`,
};

const Root = styled('div')(({theme}) => ({
  [`& .${classes.logoContainer}`]: {
    width: '33%',
    maxWidth: 100,
  },

  [`& .${classes.logo}`]: {
    width: '100%',
  },

  [`&.${classes.root}`]: {
    padding: theme.spacing(5, 0),
    marginBottom: 25,
    overflow: 'hidden',
  },
}));

const Footer = () => {
  const theme = useTheme();

  return (
    <Root className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} justifyContent="center" alignItems="center">
          <a className={classes.logoContainer} href="/">
            <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo} />
          </a>
        </Grid>
      </Grid>
    </Root>
  );
};

export default React.memo(Footer);
