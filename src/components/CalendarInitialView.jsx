import { useState } from 'react';
import '../style/calendarInitialView.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { Event as EventIcon } from '@mui/icons-material';

export default function CalendarInitialView({ handleViewChange }) {
  const [selectedValue, setSelectedValue] = useState('timeGridWeek');

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}></div>

        <Dropdown className="dropDownView" size="sm">
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            <EventIcon fontSize="20px" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              className={selectedValue === 'dayGridMonth' ? 'selected' : ''}
              onClick={() => {
                setSelectedValue('dayGridMonth');

                handleViewChange('dayGridMonth');
              }}
            >
              Month
            </Dropdown.Item>
            <Dropdown.Item
              className={selectedValue === 'timeGridWeek' ? 'selected' : ''}
              onClick={() => {
                setSelectedValue('timeGridWeek');

                handleViewChange('timeGridWeek');
              }}
            >
              Week
            </Dropdown.Item>
            <Dropdown.Item
              className={selectedValue === 'timeGridDay' ? 'selected' : ''}
              onClick={() => {
                setSelectedValue('timeGridDay');

                handleViewChange('timeGridDay');
              }}
            >
              Day
            </Dropdown.Item>
            <Dropdown.Item
              className={selectedValue === 'listMonth' ? 'selected' : ''}
              onClick={() => {
                setSelectedValue('listMonth');
                handleViewChange('listMonth');
              }}
            >
              List View
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <div className="radioButton">
          <label className={selectedValue === 'dayGridMonth' ? 'selected' : ''}>
            <input
              type="radio"
              name="initialView"
              value="dayGridMonth"
              checked={selectedValue === 'dayGridMonth'}
              onChange={(e) => {
                handleViewChange(e.target.value);
                handleRadioChange(e.target.value);
              }}
            />
            Month
          </label>
          <label className={selectedValue === 'timeGridWeek' ? 'selected' : ''}>
            <input
              type="radio"
              name="initialView"
              value="timeGridWeek"
              checked={selectedValue === 'timeGridWeek'}
              onChange={(e) => {
                handleViewChange(e.target.value);
                handleRadioChange(e.target.value);
              }}
            />
            Week
          </label>
          <label className={selectedValue === 'timeGridDay' ? 'selected' : ''}>
            <input
              type="radio"
              name="initialView"
              value="timeGridDay"
              checked={selectedValue === 'timeGridDay'}
              onChange={(e) => {
                handleViewChange(e.target.value);
                handleRadioChange(e.target.value);
              }}
            />
            Day
          </label>
          <label className={selectedValue === 'listMonth' ? 'selected' : ''}>
            <input
              type="radio"
              name="initialView"
              value="listMonth"
              checked={selectedValue === 'listMonth'}
              onChange={(e) => {
                handleViewChange(e.target.value);
                handleRadioChange(e.target.value);
              }}
            />
            List View
          </label>
        </div>
      </div>
    </>
  );
}
