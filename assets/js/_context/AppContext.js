import React, {useReducer} from 'react';
import {merge as _merge} from 'lodash';
const initialState = {
  loader: {
    active: false,
  },
};

export const LOADER_OPEN = 'LOADER_OPEN';
export const LOADER_CLOSE = 'LOADER_CLOSE';

export const AppReducer = (state, action) => {
  let newState = {...state};
  switch (action) {
    case LOADER_OPEN:
      return _merge(newState, {loader: {active: false}});
    case LOADER_CLOSE:
      return _merge(newState, {loader: {active: true}});
  }
  return newState;
};

export const AppContext = React.createContext(initialState);

export const AppProvider = ({children}) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  return <AppContext.Provider value={{state, dispatch}}>{children}</AppContext.Provider>;
};
