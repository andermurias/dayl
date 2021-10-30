import React from 'react';

import {makeStyles} from '@mui/styles';

import logo from '../../../static/img/logo/dayl_logo_full_white.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 0),
  },
  logo: {
    opacity: '.02',
    width: '50%',
    maxWidth: 300,
  },
}));

const Empty = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={logo} alt="Dayl" className={classes.logo} />
    </div>
  );
};

export default Empty;
