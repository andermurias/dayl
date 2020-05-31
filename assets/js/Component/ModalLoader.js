import React, {useContext, useEffect, useState} from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
import {AppContext} from "../_context/AppContext";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalLoader = () => {
  const classes = useStyles();
  const [context] = useContext(AppContext);

  return (
    <Backdrop className={classes.backdrop} open={context.loading}>
      <CircularProgress color="secondary" size="6rem" />
    </Backdrop>
  );
}

export default React.memo(ModalLoader);