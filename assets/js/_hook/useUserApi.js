import {useContext} from 'react';

import {useApiClient} from './useApiClient';

import {logout} from '../Common/Helper';
import {AppContext} from '../_context/AppContext';

export const useUserApi = () => {
  const {client} = useApiClient();

  const {setToken} = useContext(AppContext);

  const registerUser = ({code}) => client.post('/api/auth/google', {code: code});

  const refreshToken = ({refreshToken}) => client.post('/api/token/refresh', {refresh_token: refreshToken});

  const refreshTokenAndSave = (rToken) =>
    refreshToken({refreshToken: rToken})
      .then((res) => {
        localStorage.setItem('refreshToken', res.data.refresh_token);
        setToken(res.data.token);
      })
      .catch(logout);

  return {
    registerUser,
    refreshToken,
    refreshTokenAndSave,
  };
};
