import {useApiClient} from './useApiClient';

export const useUserApi = () => {
  const {client} = useApiClient();

  const registerUser = ({token}) => client.post('/api/auth/google', {token: token});

  const refreshToken = ({refreshToken}) => client.post('/api/token/refresh', {refresh_token: refreshToken});

  return {
    registerUser,
    refreshToken,
  };
};
