import React from 'react';

import {styled} from '@mui/material/styles';

import {makeStyles} from '@mui/styles';

import logo from '../../../static/img/logo/dayl_logo_full_white.svg';

const PREFIX = 'Empty';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
};

const Root = styled('div')(({theme}) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 0),
  },

  [`& .${classes.logo}`]: {
    opacity: '.02',
    width: '50%',
    maxWidth: 300,
  },
}));

const Empty = () => {
  return (
    <Root className={classes.root}>
      <img src={logo} alt="Dayl" className={classes.logo} />
    </Root>
  );
};

export default Empty;
