import React, {useReducer} from 'react';
import {merge as _merge} from 'lodash';

const initialState = {
  loader: {
    active: false,
  },
};

export const PendingTaskReducer = (state, stateUpdate) => {
  let newState = {...state};
  return _merge(newState, stateUpdate);

};

export const PendingTaskContext = React.createContext(initialState);

export const PendingTaskProvider = ({children}) => {
  const [state, dispatch] = useReducer(PendingTaskReducer, initialState);
  return <PendingTaskContext.Provider value={{state, dispatch}}>{children}</PendingTaskContext.Provider>;
};
