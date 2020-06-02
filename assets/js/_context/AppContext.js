import React, {useReducer} from 'react';
import {merge as _merge} from 'lodash';
import moment from "moment";

const initialState = {
  currentDate: moment().format('YYYY-MM-DD'),
  loading: false
};

const reducer = (state, update) => ({...state, ...update});

export const AppContext = React.createContext(initialState);

export const AppProvider = ({children}) => {
  const [context, reduce] = useReducer(reducer, initialState);
  const setContext = newContext => reduce(newContext);

  return <AppContext.Provider value={[context, setContext]}>{children}</AppContext.Provider>;
}
