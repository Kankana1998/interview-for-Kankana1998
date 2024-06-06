import React, { useContext, useState, useEffect, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DateRangePicker, createStaticRanges } from 'react-date-range';
import { LaunchStatusContext } from '../utils/LaunchContext';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { subWeeks, subMonths, subYears } from 'date-fns';

const FilterSection = () => {
  const launches = ['All Launches', 'Upcoming Launches', 'Successful Launches', 'Failed Launches'];
  const { selectedLaunchStatus, handleStatusChange, selectedDateRange, handleDateRangeChange } = useContext(LaunchStatusContext); 
  const [open, setOpen] = useState(false);
  const dateRangeRef = useRef(null);

  const presetRanges = [
    { label: 'Past week', range: { startDate: subWeeks(new Date(), 1), endDate: new Date() } },
    { label: 'Past month', range: { startDate: subMonths(new Date(), 1), endDate: new Date() } },
    { label: 'Past 3 months', range: { startDate: subMonths(new Date(), 3), endDate: new Date() } },
    { label: 'Past 6 months', range: { startDate: subMonths(new Date(), 6), endDate: new Date() } },
    { label: 'Past year', range: { startDate: subYears(new Date(), 1), endDate: new Date() } },
    { label: 'Past 2 years', range: { startDate: subYears(new Date(), 2), endDate: new Date() } },
  ];

  const customStaticRanges = createStaticRanges(
    presetRanges.map(preset => ({
      label: preset.label,
      range: () => preset.range,
    }))
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleRemoveDateRange = () => {
    handleDateRangeChange({ selection: null });
  };

  return (
    <div className="w-[90%] mt-4 flex flex-wrap justify-between items-center relative">
      <div className="sm:w-auto mb-2 sm:mb-0 mr-2 sm:mr-4 ml-[10%] relative" ref={dateRangeRef}>
        <div className="flex items-center">
          <button onClick={toggleOpen} className="border border-xl p-4 rounded-lg border-gray-400">
            Select Date Range
          </button>
          {selectedDateRange && selectedDateRange.startDate && selectedDateRange.endDate && (
            <button onClick={handleRemoveDateRange} className="ml-2 text-red-500">
              <span className="ml-2 border border-xl p-4 rounded-lg border-gray-400">Clear</span> 
            </button>
          )}
        </div>
        {open && (
          <div className="absolute z-10 mt-2 bg-white shadow-lg border rounded-lg p-4">
            <DateRangePicker
              ranges={[{ startDate: selectedDateRange?.startDate || new Date(), endDate: selectedDateRange?.endDate || new Date(), key: 'selection' }]}
              onChange={handleDateRangeChange}
              className="date-range-picker"
              months={2}
              direction="horizontal"
              showDateDisplay={false}
              staticRanges={customStaticRanges}
              inputRanges={[]}
            />
          </div>
        )}
      </div>
      <div className="w-auto">
        <Autocomplete
          options={launches}
          value={selectedLaunchStatus}
          onChange={(_, newValue) => handleStatusChange(newValue)}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
          filterSelectedOptions
          defaultValue={launches[0]}
          style={{ width: '200px' }}
        />
      </div>
    </div>
  );
};

export default FilterSection;
