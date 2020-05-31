import React, {useState} from 'react';
import {merge as _merge} from 'lodash';
import moment from "moment";

const initialState = [];

export const AppContext = React.createContext(initialState);

export const AppProvider = ({children}) => {
  const [context, setState] = useState(
    {
      currentDate: moment().format('YYYY-MM-DD'),
      loading: false
    }
  );
  const setContext = newContext => setState({...context, ...newContext});

  return <AppContext.Provider value={[context, setContext]}>{children}</AppContext.Provider>;
}
