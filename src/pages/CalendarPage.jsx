import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useState, useEffect } from 'react';
import '../style/calendarPage.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { parse, format, subMinutes, subHours, addMinutes } from 'date-fns';

import axios from 'axios';

import CalendarModal from '../components/CalendarModal';

export default function CalendarPage() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [preload] = useState(false);
  const [active] = useState('Calendar');

  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);

  const [nameP, setNamep] = useState('');
  const [emailP, setEmailP] = useState('');
  const [endTime, setEndTime] = useState('');
  const [servicesP, setServicesP] = useState('');
  const [notesP, setNotesP] = useState('');
  const [timeS, setTimeS] = useState('');
  const [durationP, setTimeDurationP] = useState('');
  const [statusP, setStatusP] = useState('');
  const [phoneNum, setPhoneNum] = useState(0);
  const [id, setId] = useState(0);

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log('dashboard ' + sidePanelOPen);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchPatientBooking = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_CALENDARBOOKING);
      console.log(response.data);
      setEvents(response.data.Marikina);

      console.log(response.data.Marikina);
    } catch (error) {
      console.log('Failed to fetch patient booking details: ', error);
    }
  };

  const addDuration = (time, duration) => {
    // Parse the time string into a Date object
    const parsedTime = parse(time, 'HH:mm', new Date());
    const [amount, unit] = duration.split(' ');

    let updatedTime;
    if (unit.includes('hr')) {
      updatedTime = addMinutes(parsedTime, parseInt(amount * 60));
    } else if (unit.includes('min')) {
      updatedTime = addMinutes(parsedTime, parseInt(amount));
    }

    // Format the updated time back to the desired format
    return format(updatedTime, 'hh:mm a');
  };

  useEffect(() => {
    fetchPatientBooking();
  }, []);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];

  function renderEventInfo(eventInfo) {
    return (
      <div
        className="custom-event"
        style={{
          backgroundColor: eventInfo.event.backgroundColor,
          width: '100%',
        }}
        onClick={() => {
          setShowModal(true);
          setNamep(eventInfo.event.title);
          setEmailP(eventInfo.event.extendedProps.email);
          setServicesP(eventInfo.event.extendedProps.services);
          setNotesP(eventInfo.event.extendedProps.notes);
          setStatusP(eventInfo.event.extendedProps.status);
          setTimeS(eventInfo.event.extendedProps.timeStart);
          setTimeDurationP(eventInfo.event.extendedProps.durationP);
          setPhoneNum(eventInfo.event.extendedProps.phoneNum);
          setId(eventInfo.event.id);
          console.log(id);
          setEndTime(
            addDuration(eventInfo.event.extendedProps.timeStart, eventInfo.event.extendedProps.durationP)
          );
        }}
      >
        <span style={{ fontSize: '12px', color: '#333', fontWeight: '500' }}>{eventInfo.timeText} : </span>
        <span style={{ fontSize: '12px' }}>{eventInfo.event.title} </span>{' '}
        <span style={{ color: '#333', fontSize: '12px', fontWeight: 'lighter' }}>for</span>
        <span style={{ fontSize: '12px', color: '#fff' }}> {eventInfo.event.extendedProps.services}</span>
      </div>
    );
  }

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />

      <div className="calendarView">
        <div className="calendarContent">
          <div className="fullCalendarView">
            <FullCalendar
              initialDate={formattedDate}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView="timeGridWeek"
              navLinks={true}
              //   dayMaxEvents={true}
              contentHeight="575px"
              headerToolbar={{
                left: 'today',
                center: 'prev title next',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
              }}
              slotMinTime="10:00:00"
              slotMaxTime="18:00:00"
              slotDuration="00:15:00"
              //   weekends={false}
              events={events}
              // eventContent={(eventInfo) => renderEventContent(eventInfo, handleShowModal)}
              eventContent={(eventInfo) => renderEventInfo(eventInfo)}
            />
          </div>
        </div>
      </div>

      <CalendarModal
        showModal={showModal}
        closeModal={closeModal}
        nameP={nameP}
        emailP={emailP}
        servicesP={servicesP}
        notesP={notesP}
        statusP={statusP}
        timeS={timeS}
        durationP={durationP}
        phoneNum={phoneNum}
        endTime={endTime}
        id={id}
      />
    </>
  );
}
