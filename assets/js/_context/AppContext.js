import React, {useState} from 'react';
import moment from "moment";

export const AppContext = React.createContext({});

export const AppProvider = ({children}) => {
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const [editTask, setEditTask] = useState(null);

  return <AppContext.Provider value={{
    currentDate,
    setCurrentDate,
    loading,
    setLoading,
    editTask,
    setEditTask
  }}>{children}</AppContext.Provider>;
}
