import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useEffect, useState, useRef, useContext } from 'react';
import '../style/calendarPage.css';
import MyProvider from '../MyProvider';
import MyContext from '../MyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from '../r-store/store';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { parse, format, addMinutes } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import CalendarModal from '../components/CalendarModal';
import CalendarModalCreate from '../components/CalendarModalCreate';
import CustomDropdown from '../components/CustomDropdown';
import { createRoot } from 'react-dom/client';
import { fetchPatientBooking } from '../reactQueryApi/api';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingList, setSelectBranch } from '../r-actions/actions';
import Swal from 'sweetalert2';

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

  const { setBranchLoc, id, setId } = useContext(MyContext);

  const bookingR = useSelector((state) => state.booking.bookingList);
  const dispatch = useDispatch();
  const selectBranchView = useSelector((state) => state.booking.selectedBranchR);

  const calendarRef = useRef(null);

  const togglePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowModalCreate(false);
  };

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
          setEndTime(addDuration(eventInfo.event.extendedProps.timeStart, eventInfo.event.extendedProps.durationP));
          setBranchLoc(eventInfo.event.extendedProps.branch);
        }}
      >
        <span style={{ fontSize: '12px', color: '#333', fontWeight: '500' }}>{eventInfo.timeText} : </span>
        <span style={{ fontSize: '12px' }}>{eventInfo.event.title} </span>{' '}
        <span style={{ color: '#333', fontSize: '12px', fontWeight: 'lighter' }}>for</span>
        <span style={{ fontSize: '12px', color: '#fff' }}> {eventInfo.event.extendedProps.services}</span>
      </div>
    );
  }

  // Fetch function

  const {
    data: events,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['patientBooking'],
    queryFn: fetchPatientBooking,
  });

  useEffect(() => {
    // Access the first object in the array
    if (events && selectBranchView == '') {
      const firstItem = events[0];
      // Get the keys of the first object
      const keys = Object.keys(firstItem);
      // Use the first key to access the value
      const firstKey = keys[0];
      const firstValue = firstItem[firstKey];

      console.log('try', firstValue);
      dispatch(dispatch(setBookingList(firstValue)));
    }

    const filteredList = events?.find((booking) => booking[selectBranchView]);

    if (filteredList) {
      dispatch(dispatch(setBookingList(filteredList[selectBranchView])));
    }
  }, [events, selectBranchView]);

  const queryClient = new QueryClient();
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (calendarRef.current) {
        const toolbarLeft = calendarRef.current.getApi().el.querySelector('.fc-toolbar-chunk:first-child');
        if (toolbarLeft && !toolbarLeft.querySelector('.custom-dropdown-container')) {
          const dropdownContainer = document.createElement('div');
          dropdownContainer.className = 'custom-dropdown-container';
          toolbarLeft.appendChild(dropdownContainer);

          createRoot(dropdownContainer).render(
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                <MyProvider>
                  <CustomDropdown />
                </MyProvider>
              </QueryClientProvider>
            </Provider>
          );
          clearInterval(intervalId);
        }
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   const interValid = setInterval(() => {
  //     const testA = document.querySelector('.fc-toolbar-chunk:first-child');
  //     if (testA && !testA.querySelector('.custom-dropdown-container')) {
  //       const dropDownCont = document.createElement('div');
  //       dropDownCont.className = 'custom-dropdown-container';
  //       testA.appendChild(dropDownCont);

  //       createRoot(dropDownCont).render(
  //         <QueryClientProvider client={queryClient}>
  //           <MyProvider>
  //             <CustomDropdown />
  //           </MyProvider>
  //         </QueryClientProvider>
  //       );
  //       clearInterval(interValid);
  //     }
  //     console.log('HEINER');
  //   }, 100);
  //   return () => clearInterval(interValid);
  // }, []);

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
              ref={calendarRef}
              initialDate={formattedDate}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
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
              events={bookingR}
              eventContent={(eventInfo) => renderEventInfo(eventInfo)}
              editable={true}
              droppable={true}
              eventDrop={(info) => {
                Swal.fire({
                  title: 'Are you sure?',
                  text: 'You want to reschedule this appointment?',

                  showCancelButton: true,
                  reverseButtons: true, // Add this line to swap the buttons
                  cancelButtonColor: '#C8C8C8',
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'Yes',
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      title: 'Rescheduled!',
                      text: 'Rescheduled booking successfully.',
                      icon: 'success',
                    });
                  }
                });
                // Update the event with the new date
                const updatedEvent = {
                  id: info.event.id,
                  start: info.event.start,
                  end: info.event.end,
                };
                // Call a function to handle the update (e.g., send to server)
                // handleEventUpdate(updatedEvent);
              }}
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
