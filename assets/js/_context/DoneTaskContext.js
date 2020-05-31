import React, {useState} from 'react';

const initialState = [];
export const DoneTaskContext = React.createContext(initialState);

export const DoneTaskProvider = ({children}) => {
  const [state, dispatch] = useState(initialState);
  return <DoneTaskContext.Provider value={[state, dispatch]}>{children}</DoneTaskContext.Provider>;
};
