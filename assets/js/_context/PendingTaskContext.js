import React, {useState} from 'react';

const initialState = [];
export const PendingTaskContext = React.createContext(initialState);

export const PendingTaskProvider = ({children}) => {
  const [state, dispatch] = useState(initialState);
  return <PendingTaskContext.Provider value={[state, dispatch]}>{children}</PendingTaskContext.Provider>;
};
