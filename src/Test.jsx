import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

export default function Test() {
  const eventss = [
    {
      title: 'Event 1',
      start: '2024-05-01',
      backgroundColor: '#4096fa',
    },
    {
      title: 'Event 2',
      start: '2024-05-02',
      backgroundColor: 'green',
    },
    {
      title: 'Event 3',
      start: '2024-05-03',
      backgroundColor: '#4096fa',
    },
  ];

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];
  return (
    <>
      <FullCalendar
        initialDate={formattedDate}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        navLinks={true}
        dayMaxEventRows={true}
        contentHeight="575px"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        }}
        slotMinTime="10:00:00"
        slotMaxTime="19:00:00"
        // weekends={false}
        events={eventss}

        // eventContent={(eventInfo) => renderEventContent(eventInfo, handleShowModal)}
      />
    </>
  );
}
