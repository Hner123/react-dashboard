import { useState, useEffect } from 'react';
import '../style/calendar.css';
import axios from 'axios';

export default function Calendar() {
  const [month, setMonth] = useState(0);
  const [numbersArray, setNumbersArray] = useState([]);
  const [blankDay, setBlankDay] = useState([]);
  const [today, setToday] = useState(0);
  const [selection, setSelection] = useState('Month');
  const [monthLabel, setMonthLabel] = useState('');

  const [disableDay2, setDisableDay] = useState([]);
  const [disableMonth, setDisableMonth] = useState([]);
  const [disableYear, setDisableYear] = useState([]);

  const [disableDate, setDisableDate] = useState([29, 30]);

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth2 = currentDate.getMonth();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const currentYear2 = currentDate.getFullYear();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const fetchData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_RESCHEDULE);
      console.log('fetch success :', response.data.disableDay[0].SameDayCount);

      for (let i = 0; i < response.data.disableDay.length; i++) {
        if (response.data.disableDay[i].SameDayCount === 18) {
          setDisableYear((prevState) => [...prevState, parseInt(response.data.disableDay[i].Year)]);
          setDisableMonth((prevState) => [...prevState, parseInt(response.data.disableDay[i].Month)]);
          setDisableDay((prevState) => [...prevState, parseInt(response.data.disableDay[i].Day)]);
          console.log('ito ung day : ' + disableDay2 + '-' + disableMonth + '-' + disableYear);
        }
      }

      // console.log('fetch success :', JSON.stringify(response.data.Booking_Details));
    } catch (error) {
      console.log('failed fetching of dates: ', error);
    }
  };

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
    fetchData();
  }, []);

  useEffect(() => {
    generateCalendar(currentYear, currentMonth);

    // console.log('current month ito :' + currentMonth + '-' + currentMonth2);
  }, [currentMonth, currentYear]);

  return (
    <>
      <div>
        <div>
          <div className="row">
            <button
              onClick={() => console.log('NIYAWA : ' + disableDay2 + '-' + disableMonth + '-' + disableYear)}
            >
              click me
            </button>
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
            {/* disableYear */}
            {numbersArray.map((number) =>
              currentYear < currentYear2 ||
              (currentYear === currentYear2 && currentMonth < currentMonth2) ||
              (currentYear === currentYear2 && currentMonth == currentMonth2 && today > number) ||
              (disableYear.includes(currentYear) &&
                disableMonth.includes(currentMonth) &&
                disableDay2.includes(number)) ? (
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
