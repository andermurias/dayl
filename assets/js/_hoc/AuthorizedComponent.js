import React, {useContext} from 'react';

import {Redirect} from 'react-router-dom';

import {logout} from '../Common/Helper';
import {useUserApi} from '../_hook/useUserApi';
import {AppContext} from '../_context/AppContext';

const AuthorizedComponent = ({component: Component, route, ...props}) => {
  const {token, setToken, setLoading} = useContext(AppContext);
  const {refreshToken} = useUserApi();

  const isAuthenticated = () => token !== null;
  const rToken = localStorage.getItem('refreshToken');

  if (!isAuthenticated() && rToken) {
    refreshToken({refreshToken: rToken})
      .then((res) => {
        localStorage.setItem('refreshToken', res.data.refresh_token);
        setToken(res.data.token);
        setLoading(false);
      })
      .catch(logout);
    return <></>;
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
