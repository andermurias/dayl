import React, {useState} from 'react';

export const CalendarContext = React.createContext({});

export const CalendarProvider = ({children}) => {
  const [calendarData, setCalendarData] = useState({month: {}, days: []});
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [popoverDayIdx, setPopoverDayIdx] = useState(0);

  const handleMoreClick = (dayIdx) => (e) => {
    setPopoverDayIdx(dayIdx);
    setPopoverAnchor(e.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setPopoverDayIdx(0);
  };

  return (
    <CalendarContext.Provider
      value={{
        calendarData,
        setCalendarData,
        popoverAnchor,
        setPopoverAnchor,
        popoverDayIdx,
        setPopoverDayIdx,
        handleMoreClick,
        handlePopoverClose,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
