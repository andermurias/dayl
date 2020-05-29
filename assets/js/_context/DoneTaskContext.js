import React, {useReducer} from 'react';
import {merge as _merge} from 'lodash';

const initialState = {
  loader: {
    active: false,
  },
};

export const DoneTaskReducer = (state, stateUpdate) => {
  let newState = {...state};
  return _merge(newState, stateUpdate);

};

export const DoneTaskContext = React.createContext(initialState);

export const DoneTaskProvider = ({children}) => {
  const [state, dispatch] = useReducer(DoneTaskReducer, initialState);
  return <DoneTaskContext.Provider value={{state, dispatch}}>{children}</DoneTaskContext.Provider>;
};
