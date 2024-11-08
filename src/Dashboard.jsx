import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import SidePanel from './components/SidePanel';
import './style/dashboad.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import DataTable from 'datatables.net-bs5';
// import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CircleIcon from '@mui/icons-material/Circle';
import Spinner from 'react-bootstrap/Spinner';
import EventIcon from '@mui/icons-material/Event';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

// import interactionPlugin from "@fullcalendar/interaction";
import AmChart from './components/AmChart';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import faker from "faker";
import { Person } from '@mui/icons-material';
import { EventNote } from '@mui/icons-material';
import { GroupAdd } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [totalPatient, SetTotalPatient] = useState();
  const [totalAppointments, SetTotalAppointments] = useState();
  const [totalSales, SetTotalSales] = useState();
  const [todayPatient, SetTodayPatient] = useState();
  const [dataq, SetData] = useState([]);
  const [events, setEvents] = useState([]);
  const [preload, setPreload] = useState(true);
  const [active, setActive] = useState('Dashboard');
  const [todayPatientsValue, setTodayPatientsValue] = useState(0);
  const [todaySalesPercentage, setTodaySalesPercentage] = useState(0);
  const [patientAddedLastmonth, setPatientAddedLastMonth] = useState(0);
  const [yesterdayCompleted, setYesterdayCompleted] = useState(0);
  const [getCompleted, setGetCompleted] = useState([]);
  const [getCancelled, setGetCancelled] = useState([]);
  const [notes, setNotes] = useState('');
  const [services, setServices] = useState('');
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [lokasyon, setLokasyon] = useState('Marikina');

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log('dashboard ' + sidePanelOPen);
  };

  const handleStatusData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_DATA);
      console.log('Post successful:', response.data);

      setTodayPatientsValue(response.data.percentage_Patients_vs_yesterday);
      setTodaySalesPercentage(response.data.percentageSales_today_vs_yesterday);
      setPatientAddedLastMonth(response.data.totalPatientLastMonth);
      setYesterdayCompleted(response.data.SuccessProcessYesterday);
      setGetCompleted(response.data.completed);
      setGetCancelled(response.data.cancelled);
      setEvents(response.data.Calendar_Marikina);

      SetData(response.data.responselast30daysRange);
      SetTotalPatient(response.data.totalPatient);
      SetTotalAppointments(response.data.totalAppointment);
      SetTotalSales(response.data.todaySalesTotal);
      SetTodayPatient(response.data.todayPatient);
      // SetConfirmnames(response.data.sample);
      // SetConfirmSched(response.data.ConfirmAllBooking);

      // console.log(tableRef.current);
      // new DataTable('#example', {

      const table = new DataTable('#myTable', {
        data: response.data.upComingPatient,
        columns: [{ title: 'Schedule' }, { title: 'Name' }],
        autoWidth: false,
        destroy: true, // I think some clean up is happening here
        paging: false,
        info: false,
        searching: false,
        deferRender: true,
        fixedHeader: {
          header: true,
          footer: true,
        },
        scrollCollapse: true,
        scrollY: 300,
        scroller: true,
      });
      // Extra step to do extra clean-up.
      return function () {
        console.log('Table destroyed');
        table.destroy();
      };
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setPreload(false);
    }
  };

  const filterCalendarLoc = async (loc) => {
    try {
      setCalendarLoading(true);
      const response = await axios.post(process.env.REACT_APP_DATA);
      console.log('Post successful:', response.data);

      if (loc === 'Marikina') {
        setEvents(response.data.Calendar_Marikina);
      } else {
        setEvents(response.data.Calendar_Antipolo);
      }
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setTimeout(() => {
        setCalendarLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    handleStatusData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Completed Vs Cancelled',
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1, // Display whole numbers only
          precision: 0, // Display whole numbers only
        },
      },
    },
  };

  const weeklySalesData = {
    // labels,
    datasets: [
      {
        label: 'Cancelled',
        data: getCancelled,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Completed',
        data: getCompleted,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const [showModal, setShowModal] = useState(false);
  const [titleEvent, setTitleEvent] = useState('');

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleShowModal = () => {
    setShowModal(true);
  };

  const fetchFeedList = async () => {
    const response = await axios.post(process.env.REACT_APP_FETCHFEEDLIST);
    console.log('CASDQWE ', response.data);
    return response.data;
  };

  const {
    data: feedList,
    error: error,
    isLoading: loading,
  } = useQuery({
    queryKey: ['feedList'],
    queryFn: fetchFeedList,
  });

  function renderEventContent(eventInfo, handleShowModal) {
    return (
      <>
        <b style={{ fontSize: '12px', color: 'red' }}>
          <CircleIcon style={{ fontSize: '10px', color: '#00FF00' }} />
          {eventInfo.timeText}&nbsp;
        </b>
        <span
          style={{ cursor: 'pointer', fontSize: '12px', color: 'red' }}
          onClick={() => {
            setTitleEvent(eventInfo.event.title);
            setNotes(eventInfo.event.extendedProps.notes);
            setServices(eventInfo.event.extendedProps.services);
            handleShowModal();
          }}
        >
          {eventInfo.event.title}
        </span>
      </>
    );
  }

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];

  const testRA = [
    {
      id: 20,
      feed_title: 'Appointment Created',
      feed_info: 'Appointment with Dokie Doks  on Oct 06, 10:45 AM',
      feed_timeStamp: 'Nov 5, 2024 1:48 am',
    },
    {
      id: 21,
      feed_title: 'Appointment Created',
      feed_info: 'Appointment with Heiner Aborka  on Oct 06, 10:00 AM',
      feed_timeStamp: 'Nov 5, 2024 1:50 am',
    },
  ];

  const iconMap = {
    'Appointment Created': <EventIcon fontSize="large" titleAccess="Add Event" style={{ color: '#2ED8B6' }} />,
    'Appointment Cancelled': <EventBusyIcon fontSize="large" titleAccess="Appointment Unavailable" style={{ color: '#FF5370' }} />,
    'Appointment Updated': <EventAvailableIcon fontSize="large" titleAccess="Appointment Available" style={{ color: '#4099FF' }} />,
    'Created New Customer': <GroupAddIcon fontSize="large" titleAccess="Add to Customer List" style={{ color: '#2ED8B6' }} />,
    'Location Updated': <EditLocationIcon fontSize="large" titleAccess="Edit Location" style={{ color: '#4099FF' }} />,
    'Location Created': <AddLocationAltIcon fontSize="large" titleAccess="Add Alternate Location" style={{ color: '#2ED8B6' }} />,
    'Location Deleted': <LocationOffIcon fontSize="large" titleAccess="Location Disabled" style={{ color: '#FF5370' }} />,
    'Service Created': <AddBusinessIcon fontSize="large" titleAccess="Add Business Service" style={{ color: '#2ED8B6' }} />,
    'Service Deleted': <RemoveCircleIcon fontSize="large" titleAccess="Remove Service" style={{ color: '#FF5370' }} />,
  };

  return (
    <div className="dash">
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />
      <div>
        <div className="dashboard">
          <h5>Dashboard</h5>
          {/* ****************************4 BOX STATS************************ */}

          <div className="row stats d-flex justify-content-center">
            <div className="col-md-3 blue">
              <div className="row">
                <div className="col-md">
                  <span>Today's Patient </span>
                  <h4>{todayPatient}</h4>
                </div>
                <div className="col-md">
                  <span className="d-flex justify-content-end">
                    <Person className="statsBlue" />
                  </span>
                </div>
              </div>
              <div className="mt-4">
                {todayPatientsValue < 0 ? (
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-down-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                    {todayPatientsValue}% vs Yesterday
                  </span>
                ) : (
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-up-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                    </svg>
                    +{todayPatientsValue}% vs Yesterday
                  </span>
                )}
              </div>
            </div>

            <div className="col-md-3 green">
              <div className="row">
                <div className="col-md">
                  <span>Appointments</span>
                  <h4>{totalAppointments}</h4>
                </div>
                <div className="col-md">
                  <span className="d-flex justify-content-end">
                    <EventNote className="statsGreen" />
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  {yesterdayCompleted} Completed Patient/s Yesterday
                </span>
              </div>
            </div>

            <div className="col-md-3 yellow">
              <div className="row">
                <div className="col-md">
                  <span>Total Patients</span>
                  <h4>{totalPatient}</h4>
                </div>
                <div className="col-md">
                  <span className="d-flex justify-content-end">
                    <GroupAdd className="statsYellow" />
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  {patientAddedLastmonth} Added Last Month
                </span>
              </div>
            </div>

            <div className="col-md-3 red">
              <div className="row">
                <div className="col-md">
                  <span>Sales Today</span>
                  <h4>{totalSales}</h4>
                </div>
                <div className="col-md d-flex justify-content-end">
                  <span className="d-flex justify-content-center align-items-center mb-3 statsRed" style={{ fontSize: '26px', fontWeight: '500' }}>
                    ₱
                  </span>
                </div>
              </div>
              <div className="mt-4">
                {todaySalesPercentage < 0 ? (
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-down-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                    {todaySalesPercentage}% vs Yesterday
                  </span>
                ) : (
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-caret-up-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                    </svg>
                    +{todaySalesPercentage}% vs Yesterday
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* **************************upcoming Table********************** */}
          <div className="upcomingPatient d-flex justify-content-center">
            <div className="col-md">
              <p>Upcoming Appointments</p>
              <table id="myTable" className="row-border" style={{ width: '100%' }}></table>
            </div>
            <div className="col-md activityFeedInfo">
              <p>Activity Feed</p>

              <div className="feedList">
                {feedList
                  ?.sort((a, b) => b.id - a.id) // Sort in descending order
                  .map((FList, index) => (
                    <div className="feed_view" key={index}>
                      <div className="row">
                        <div className="col-md-2">{iconMap[FList.feed_title] || null}</div>
                        <div className="col-md-10">
                          <div className="col-sm feedTitle">{FList.feed_title}</div>
                          <div className="col-sm feedInfo">
                            {FList.feed_info}
                            <label className="activity-tstamp">{FList.feed_timeStamp}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* **************************FULL CALENDAR********************** */}
          {/* <div className="fullCalendar">
            <div className="d-flex justify-content-center">
              <div className="col-md-6 d-flex justify-content-center">
                <button
                  onClick={() => {
                    filterCalendarLoc('Marikina');
                    setLokasyon('Marikina');
                  }}
                  className={lokasyon == 'Marikina' ? 'btn btn-primary btn-md me-5' : 'btn btn-md me-5'}
                >
                  Marikina
                </button>
                <button
                  onClick={() => {
                    filterCalendarLoc('Antipolo');
                    setLokasyon('Antipolo');
                  }}
                  className={lokasyon == 'Antipolo' ? 'btn btn-primary btn-md' : 'btn btn-md'}
                >
                  Antipolo
                </button>
              </div>
            </div>
            <div className="callendarSize">
              {calendarLoading && (
                <div className="forLoading d-flex justify-content-center align-items-center">
                  <Spinner
                    style={{ borderWidth: '8px', height: '4rem', width: '4rem', display: 'block' }}
                    animation="border"
                    variant="primary"
                  />
                </div>
              )}

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
                events={events}
                eventContent={(eventInfo) => renderEventContent(eventInfo, handleShowModal)}
              />
            </div>
          </div> */}

          <div className="amChart">
            <h5>Sales for the last 30 days till now</h5>
            <AmChart />
          </div>
        </div>
      </div>
      <Modal size="md" show={showModal} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">{titleEvent} </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Notes : </strong>
            {notes}
          </p>
          <p>
            <strong>Services : </strong>
            {services}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
