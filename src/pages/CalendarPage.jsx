import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useEffect, useState } from 'react';
import '../style/calendarPage.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { parse, format, addMinutes } from 'date-fns';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import CalendarModal from '../components/CalendarModal';
import CalendarModalCreate from '../components/CalendarModalCreate';

export default function CalendarPage() {
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [preload] = useState(false);
  const [active] = useState('Calendar');

  const [showModal, setShowModal] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);

  const [nameP, setNamep] = useState('');
  const [emailP, setEmailP] = useState('');
  const [endTime, setEndTime] = useState('');
  const [servicesP, setServicesP] = useState('');
  const [notesP, setNotesP] = useState('');
  const [timeS, setTimeS] = useState('00:00');
  const [durationP, setTimeDurationP] = useState('');
  const [statusP, setStatusP] = useState('');
  const [phoneNum, setPhoneNum] = useState(0);
  const [id, setId] = useState(0);

  const togglePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowModalCreate(false);
  };

  // Fetch function
  const fetchPatientBooking = async () => {
    const response = await axios.post(process.env.REACT_APP_CALENDARBOOKING);
    return response.data.Marikina;
  };

  const {
    data: events,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['patientBooking'],
    queryFn: fetchPatientBooking,
  });

  const addDuration = (time, duration) => {
    const parsedTime = parse(time, 'HH:mm', new Date());
    const [amount, unit] = duration.split(' ');

    let updatedTime;
    if (unit.includes('hr')) {
      updatedTime = addMinutes(parsedTime, parseInt(amount * 60));
    } else if (unit.includes('min')) {
      updatedTime = addMinutes(parsedTime, parseInt(amount));
    }

    return format(updatedTime, 'hh:mm a');
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOpen} preload={preload} />
      <SidePanel isOpen={sidePanelOpen} togglePanel={togglePanel} activeNav={active} />

      <div className="calendarView">
        <div className="calendarContent">
          <div className="fullCalendarView">
            <FullCalendar
              initialDate={formattedDate}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView="timeGridWeek"
              navLinks={true}
              contentHeight="575px"
              headerToolbar={{
                left: 'today',
                center: 'prev title next',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth customButton',
              }}
              customButtons={{
                customButton: {
                  text: ' + New Appointment',
                  click: () => {
                    setShowModalCreate(true);
                  },
                },
              }}
              slotMinTime="10:00:00"
              slotMaxTime="18:00:00"
              slotDuration="00:15:00"
              events={events}
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
      <CalendarModalCreate showModalCreate={showModalCreate} closeModal={closeModal} />
    </>
  );
}
