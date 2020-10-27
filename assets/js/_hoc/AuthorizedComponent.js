import React, {useContext, useEffect} from 'react';

import {Redirect} from 'react-router-dom';

import Empty from '../Component/Empty/Empty';

import {useUserApi} from '../_hook/useUserApi';
import {AppContext} from '../_context/AppContext';

const AuthorizedComponent = ({children}) => {
  const {token, loading, setLoading} = useContext(AppContext);
  const {refreshTokenAndSave} = useUserApi();

  const rToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    if (!token && rToken && !loading) {
      setLoading(true);
      refreshTokenAndSave(rToken).then(() => setLoading(false));
    }
  }, []);

  if (!rToken) {
    return <Redirect to={{pathname: '/login'}} />;
  }

  if (token && rToken) {
    return children;
  }

  return <Empty />;
};
export default React.memo(AuthorizedComponent);
