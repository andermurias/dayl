import React, {useContext} from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {makeStyles} from '@mui/styles';

import {AppContext} from '../../_context/AppContext';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalLoader = () => {
  const classes = useStyles();
  const {loading} = useContext(AppContext);

  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="secondary" size="6rem" />
    </Backdrop>
  );
};

export default React.memo(ModalLoader);
