import React, {useContext} from 'react';

import {Redirect} from 'react-router-dom';

import Empty from '../Component/Empty';

import {useUserApi} from '../_hook/useUserApi';
import {AppContext} from '../_context/AppContext';

const AuthorizedComponent = ({component: Component, route, ...props}) => {
  const {token, setLoading} = useContext(AppContext);
  const {refreshTokenAndSave} = useUserApi();

  const isAuthenticated = () => token !== null;
  const rToken = localStorage.getItem('refreshToken');

  if (!isAuthenticated() && rToken) {
    setLoading(true);
    refreshTokenAndSave(rToken).then(() => setLoading(false));
    return <Empty />;
  }

  if (route.props.secure && !isAuthenticated()) {
    return <Redirect to={{pathname: '/login'}} />;
  }

  if (route.props.isLogin && isAuthenticated()) {
    return <Redirect to={{pathname: '/tasks'}} />;
  }

  return <Component {...props} {...route.props} />;
};
export default React.memo(AuthorizedComponent);
