import { useState, useEffect } from 'react';
import '../style/calendar.css';

export default function Calendar() {
  const [month, setMonth] = useState(0);
  const [numbersArray, setNumbersArray] = useState([]);
  const [blankDay, setBlankDay] = useState([]);

  const generateCalendar = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    setMonth(daysInMonth);

    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const blankNum = [];
    for (let i = 1; i <= firstDay; i++) {
      blankNum.push(i);
    }
    setBlankDay(blankNum);

    const numbers = [];
    for (let i = 1; i <= daysInMonth; i++) {
      numbers.push(i);
    }
    setNumbersArray(numbers);
  };

  useEffect(() => {
    generateCalendar();
  }, []);

  return (
    <>
      <div className="">
        <div className=" ">
          <ul className="daysList">
            {blankDay.map((blank) => (
              <li key={blank}></li>
            ))}

            {numbersArray.map((number) => (
              <li key={number}>{number}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
