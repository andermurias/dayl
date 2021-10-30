import React, {useContext} from 'react';

import Skeleton from '@mui/material/Skeleton';

import {AppContext} from '../_context/AppContext';

const WrapSkeletonOnLoading = ({children, ...rest}) => {
  const {loading} = useContext(AppContext);

  return loading ? (
    <Skeleton animation="wave" {...rest}>
      {children}
    </Skeleton>
  ) : (
    children
  );
};

export default WrapSkeletonOnLoading;
