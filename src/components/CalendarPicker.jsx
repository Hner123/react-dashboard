import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../style/calendarPicker.css';

export default function CalendarPicker({ calendarRef }) {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [buttonText, setButtonText] = useState('Select Date');

  const calendarModalRef = useRef(null);

  const displayButtonText = () => {
    if (calendarRef.current) {
      const calendarAPI = calendarRef.current.getApi();
      setButtonText(calendarAPI.view.title);
      setSelectedDate(calendarAPI.currentData.dateProfile.currentDate);
    }
  };

  const handleTodayButtonClick = () => {
    const today = new Date();
    handleDateChange(today);
    setSelectedDate(today);
  };

  const handleDateChange = (date) => {
    setTimeout(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(date);
        setButtonText(calendarApi.view.title);
        setSelectedDate(date);
      }
      setDatePickerVisible(false); // Hide the date picker after selecting a date
    }, 0);
  };

  useEffect(() => {
    handleTodayButtonClick();
  }, []);

  useEffect(() => {
    setDatePickerVisible(false);
    function handleClickOutside(event) {
      if (calendarModalRef.current && !calendarModalRef.current.contains(event.target)) {
        setDatePickerVisible(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [calendarModalRef]);

  useEffect(() => {
    document.addEventListener('click', displayButtonText);
    console.log('CLICK LICK');
  }, []);

  return (
    <>
      <div className="datePicker">
        <button
          className="datePickerButton"
          onClick={(e) => {
            e.stopPropagation();
            setDatePickerVisible(!datePickerVisible);
          }}
        >
          {buttonText}
        </button>
        {datePickerVisible && (
          <div className="dropdown-content" ref={calendarModalRef}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                handleDateChange(date);
              }}
              inline
              calendarClassName="custom-calendar"
            />
            <button onClick={handleTodayButtonClick} className="today-button">
              Today
            </button>
          </div>
        )}
      </div>
    </>
  );
}
