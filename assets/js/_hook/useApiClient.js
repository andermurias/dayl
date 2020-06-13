import {useContext} from 'react';

import axios from 'axios';

import {AppContext} from '../_context/AppContext';

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

  return {
    client,
  };
};
