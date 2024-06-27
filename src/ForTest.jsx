import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import 'react-datepicker/dist/react-datepicker.css';
import './style/fortest.css';
import CalendarPicker from './components/CalendarPicker';

export default function ForTest() {
  const calendarRef = useRef(null);

  const events = [
    { title: 'Event 1', start: '2024-06-27', end: '2024-06-28' },
    { title: 'Event 2', start: '2024-06-29T10:00:00', end: '2024-06-29T12:00:00' },
    { title: 'Event 3', start: '2024-06-30', end: '2024-07-01' },
  ];

  return (
    <div>
      <CalendarPicker calendarRef={calendarRef} />

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: '',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={events}
        datesSet={() => {
          if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            // setPassData(calendarApi.view.title);
            // updateButtonText(calendarApi);
            console.log('NA RUN RA', calendarApi.changeView);
          }
        }}
      />
    </div>
  );
}
