import {useContext} from 'react';

import axios from 'axios';

import {AppContext} from '../_context/AppContext';
import {logout} from '../Common/Helper';

export const useApiClient = () => {
  const {token} = useContext(AppContext);

  const client = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(null, (error) => {
    if (error.config && error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  });

  return {
    client,
  };
};
