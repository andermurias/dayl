import React, {useContext} from 'react';

import {styled} from '@mui/material/styles';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {makeStyles} from '@mui/styles';

import {AppContext} from '../../_context/AppContext';

const PREFIX = 'ModalLoader';

const classes = {
  backdrop: `${PREFIX}-backdrop`,
};

const StyledBackdrop = styled(Backdrop)(({theme}) => ({
  [`&.${classes.backdrop}`]: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalLoader = () => {
  const {loading} = useContext(AppContext);

  return (
    <StyledBackdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="secondary" size="6rem" />
    </StyledBackdrop>
  );
};

export default React.memo(ModalLoader);
