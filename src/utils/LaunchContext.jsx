import React, { createContext, useState } from 'react';

const LaunchStatusContext = createContext();

const LaunchStatusProvider = ({ children }) => {
  const [selectedLaunchStatus, setSelectedLaunchStatus] = useState('All Launches'); 
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
    key: 'selection',
  });

  const handleStatusChange = (newStatus) => {
    setSelectedLaunchStatus(newStatus);
  };

  const handleDateRangeChange = (ranges) => {
    setSelectedDateRange(ranges.selection);
  };

  return (
    <LaunchStatusContext.Provider value={{ selectedLaunchStatus, handleStatusChange, selectedDateRange, handleDateRangeChange }}>
      {children}
    </LaunchStatusContext.Provider>
  );
};

export { LaunchStatusContext, LaunchStatusProvider };
