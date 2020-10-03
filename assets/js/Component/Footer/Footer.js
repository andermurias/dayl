import React from 'react';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import logo from '../../../static/img/logo/dayl_logo_full.svg';
import logoDark from '../../../static/img/logo/dayl_logo_full_dark.svg';

const useStyles = makeStyles((theme) => ({
  logoContainer: {
    width: '33%',
    maxWidth: 100,
  },
  logo: {
    width: '100%',
  },
  root: {
    padding: theme.spacing(5, 0),
    marginBottom: 25,
    overflow: 'hidden',
  },
}));

const Footer = () => {
  const classes = useStyles();

  const theme = useTheme();

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} justify="center" alignItems="center">
          <a className={classes.logoContainer} href="/">
            <img src={theme.palette.type === 'dark' ? logoDark : logo} alt="Dayl" className={classes.logo} />
          </a>
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(Footer);
