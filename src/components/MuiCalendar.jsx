import { useState, useEffect } from 'react';
import '../style/calendar.css';
import { h } from '@fullcalendar/core/preact.js';

export default function MuiCalendar() {
  const [month, setMonth] = useState(0);
  const [numbersArray, setNumbersArray] = useState([]);
  const [blankDay, setBlankDay] = useState([]);
  const [today, setToday] = useState(0);
  const [selection, setSelection] = useState('Month');
  const [monthLabel, setMonthLabel] = useState('');
  const [disabledDates, setDisabledDates] = useState([
    { year: 2024, month: 4, day: 10 },
    // Add more disabled dates here if needed
  ]);

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth2 = currentDate.getMonth();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const currentYear2 = currentDate.getFullYear();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const generateCalendar = (year, month) => {
    setToday(currentDay);

    const firstDay = new Date(year, month, 1).getDay();
    const blankNum = [];
    for (let i = 1; i <= firstDay; i++) {
      blankNum.push(i);
    }
    setBlankDay(blankNum);

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const numbers = [];
    for (let i = 1; i <= daysInMonth; i++) {
      numbers.push(i);
    }
    setNumbersArray(numbers);
    setMonth(daysInMonth);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    if (month >= 0 && month <= 11) {
      setMonthLabel(monthNames[month]);
    } else if (month >= 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else if (month <= -1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    }
  };

  useEffect(() => {
    generateCalendar(currentYear, currentMonth);
    console.log('current month ito :' + currentMonth + '-' + currentMonth2);
  }, [currentMonth, currentYear]);

  const isDateDisabled = (year, month, day) => {
    return disabledDates.some((date) => date.year == year && date.month == month + 1 && date.day == day);
  };

  return (
    <>
      <div>
        <div>
          <div className="row">
            <h5>{monthLabel + ': ' + currentYear}</h5>
            <button onClick={() => setCurrentMonth(currentMonth - 1)}>{'<'}</button>
            <button onClick={() => setCurrentMonth(currentMonth + 1)}>{'>'}</button>
          </div>
          <ul className="days">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>

          <ul className="daysList" style={{ padding: '0px' }}>
            {blankDay.map((blank) => (
              <li key={blank}></li>
            ))}

            {numbersArray.map((number) =>
              currentYear < currentYear2 ||
              (currentYear === currentYear2 && currentMonth < currentMonth2) ||
              (currentYear === currentYear2 && currentMonth == currentMonth2 && today > number) ||
              isDateDisabled(currentYear, currentMonth, number) ? (
                <li className="disableDay" key={number}>
                  {number}
                </li>
              ) : (
                <li
                  className="enableDay"
                  key={number + ' ' + currentYear}
                  onClick={() =>
                    console.log('year: ' + currentYear + ' month: ' + currentMonth + ' day :' + number)
                  }
                >
                  {number}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
