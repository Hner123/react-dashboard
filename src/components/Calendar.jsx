import { useState, useEffect, useRef } from 'react';
import '../style/calendar.css';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Spinner from 'react-bootstrap/Spinner';

export default function Calendar({ id, reschedModalClose, refreshData, userLocation }) {
  const [month, setMonth] = useState(0);
  const [numbersArray, setNumbersArray] = useState([]);
  const [blankDay, setBlankDay] = useState([]);
  const [today, setToday] = useState(0);
  const [selection, setSelection] = useState('Month');
  const [monthLabel, setMonthLabel] = useState('');
  const [timeSelect, setTimeSelect] = useState('');
  const [daySelect, setDaySelect] = useState('');

  const [disableDay2, setDisableDay] = useState([]);
  const [disableMonth, setDisableMonth] = useState([]);
  const [disableYear, setDisableYear] = useState([]);

  const [holidayDay, setHolidayDay] = useState([]);
  const [holidayMonth, setHolidayMonth] = useState([]);
  const [holidayYear, setHolidayYear] = useState([]);

  const [timeLoader, setTimeLoader] = useState(true);
  const [confirmLoader, setConfirmLoader] = useState(false);

  const [timeOption, setTimeOption] = useState([]);

  const [timeListBtn, setTimeListBtn] = useState([
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
  ]);

  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  const currentMonth2 = currentDate.getMonth();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const currentYear2 = currentDate.getFullYear();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const fetchData = async () => {
    try {
      const location = { userLocation };
      const response = await axios.post(process.env.REACT_APP_RESCHEDULE, location);
      console.log('fetch success disable list :', response.data.disableDay[0].SameDayCount);

      for (let i = 0; i < response.data.disableDay.length; i++) {
        if (response.data.disableDay[i].SameDayCount === 17) {
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

  const fetchHoliday = async () => {
    try {
      const location = { userLocation };
      const response = await axios.post(process.env.REACT_APP_HOLIDAYLIST, location);
      console.log('success fetch holiday list :', response.data.holiday);

      for (let i = 0; i < response.data.holiday.length; i++) {
        setDisableYear((prevState) => [...prevState, parseInt(response.data.holiday[i].Year)]);
        setDisableMonth((prevState) => [...prevState, parseInt(response.data.holiday[i].Month)]);
        setDisableDay((prevState) => [...prevState, parseInt(response.data.holiday[i].Day)]);
      }
    } catch (error) {
      console.log('failed fetching of holiday list: ', error);
    }
  };

  const fetchDataTime = async (number) => {
    try {
      const data = { currentYear, currentMonth, number, userLocation };
      const response = await axios.post(process.env.REACT_APP_RESCHEDULETIME, data);
      console.log('fetch data time response : ', response.data.List);
      setTimeOption(response.data.List);
      setTimeLoader(false);
    } catch (error) {
      console.log('error fetching time :', error);
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

  const sendReschedBooking = async () => {
    if (timeSelect == '' || timeSelect == null) {
      console.log('You need to select a time!');
    } else {
      try {
        const data = { id, currentYear, currentMonth, daySelect, timeSelect };
        const response = await axios.post(process.env.REACT_APP_RESCHEDULESEND, data);
        console.log('resched success :', response.data);
        refreshData();
        reschedModalClose();
      } catch (error) {
        console.log('failed to resched booking :', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchHoliday();
  }, []);

  useEffect(() => {
    generateCalendar(currentYear, currentMonth);
    // console.log('current month ito :' + currentMonth + '-' + currentMonth2);
  }, [currentMonth, currentYear]);

  return (
    <>
      <div>
        {selection === 'Month' ? (
          <div>
            <div className="row">
              <div className="col-md d-flex justify-content-end">
                {currentYear > currentYear2 || currentMonth > currentMonth2 ? (
                  <button className="btnNav" onClick={() => setCurrentMonth(currentMonth - 1)}>
                    {'<'}
                  </button>
                ) : (
                  <button className="btnNavDisable" disabled>
                    {'<'}
                  </button>
                )}
              </div>
              <div className="col-md d-flex justify-content-center">
                <p style={{ margin: '0' }}>{currentYear + ' - ' + monthLabel}</p>
              </div>
              <div className="col-md">
                <button className="btnNav" onClick={() => setCurrentMonth(currentMonth + 1)}>
                  {'>'}
                </button>
              </div>
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

              {numbersArray.map((number) => {
                const disableDay = disableYear.map(
                  (year, i) =>
                    currentYear < currentYear2 ||
                    (currentYear === currentYear2 && currentMonth < currentMonth2) ||
                    (currentYear === currentYear2 && currentMonth === currentMonth2 && today > number) ||
                    (year === currentYear && disableMonth[i] === currentMonth && disableDay2[i] === number)
                );

                return disableDay.includes(true) ? (
                  <li className="disableDay" key={number}>
                    {number}
                  </li>
                ) : (
                  <li
                    className="enableDay"
                    key={number + ' ' + currentYear}
                    onClick={() => {
                      setSelection('Time');

                      fetchDataTime(number);
                      setDaySelect(number);
                    }}
                  >
                    {number}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md">
                <button
                  className="backArrow"
                  onClick={() => {
                    setSelection('Month');
                    setTimeSelect('');
                    setTimeLoader(true);
                  }}
                >
                  <ArrowBackIcon /> Back
                </button>
              </div>
              <div className="col-md d-flex justify-content-end">
                {timeSelect === '' ? (
                  <button className="reschedBtnDisable">Confirm</button>
                ) : (
                  <button
                    className={confirmLoader ? 'reschedBtnDisable' : 'reschedBtn'}
                    onClick={() => {
                      sendReschedBooking();
                      setConfirmLoader(true);
                    }}
                  >
                    <Spinner
                      style={{
                        display: confirmLoader ? 'inline-block' : 'none',
                        height: '12px',
                        width: '12px',
                      }}
                      animation="border"
                      size="sm"
                    />
                    &nbsp;
                    {confirmLoader ? 'Saving...' : 'Confirm'}
                  </button>
                )}
              </div>
            </div>
            {timeLoader === true ? (
              <div className="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <ul className="timeList">
                {timeListBtn.map(
                  (timeList, index) =>
                    !timeOption.toString().includes(timeList) && (
                      <li
                        key={index}
                        className={timeList === timeSelect ? 'selectedTime' : ''}
                        onClick={() => {
                          setTimeSelect(timeList);
                          console.log(
                            'date to resched :' + currentYear + '-' + currentMonth + '-' + timeList + '-' + id
                          );
                        }}
                      >
                        {timeList}
                      </li>
                    )
                )}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
