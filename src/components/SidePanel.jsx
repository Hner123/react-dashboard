import '../style/sidepanel.css';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import PlaylistAddCheckCircleOutlinedIcon from '@mui/icons-material/PlaylistAddCheckCircleOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

export default function SidePanel({ isOpen, togglePanel, activeNav, acceptBooking }) {
  const [notif, setNotif] = useState(0);
  const [userRole, setUserRole] = useState('');

  const fetchDataNotif = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BOOKINGNOTIF);

      setNotif(response.data);
    } catch (error) {
      console.error('error fetching # of notif', error);
    }
  };

  useEffect(() => {
    fetchDataNotif();
  }, [acceptBooking]);

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
  }, []);

  return (
    <div>
      <div className={isOpen ? 'overlay hide' : 'overlay show'} onClick={togglePanel}></div>

      <div className={isOpen ? 'sidePanel hide' : 'sidePanel show'}>
        <div className="sidePanelList">
          <ul>
            <li>
              <Link to="/dashboard" className={activeNav === 'Dashboard' ? 'activeON' : 'activeOFF'}>
                <DashboardOutlinedIcon fontSize="small" />
                <span className="ms-2">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/pages/booking" className={activeNav === 'Booking' ? 'activeON' : 'activeOFF'}>
                <DateRangeOutlinedIcon fontSize="small" />
                <span className="ms-2" style={{ position: 'relative' }}>
                  Booking
                  {notif === 0 ? null : <span className="bookingNotif">{notif}</span>}
                </span>
              </Link>
            </li>
            <li>
              <Link to="/pages/confirm" className={activeNav === 'Confirm' ? 'activeON' : 'activeOFF'}>
                <PlaylistAddCheckCircleOutlinedIcon fontSize="small" />
                <span className="ms-2">Confirm</span>
              </Link>
            </li>

            <li>
              <Link to="/pages/calendar" className={activeNav === 'Calendar' ? 'activeON' : 'activeOFF'}>
                <EventBusyOutlinedIcon fontSize="small" />
                <span className="ms-2">Calendar</span>
              </Link>
            </li>

            <li>
              <Link to="/pages/service-setup" className={activeNav === 'ServiceSetup' ? 'activeON' : 'activeOFF'}>
                <EventBusyOutlinedIcon fontSize="small" />
                <span className="ms-2">Service Setup</span>
              </Link>
            </li>

            <li>
              <Link to="/pages/cancelled" className={activeNav === 'Cancelled' ? 'activeON' : 'activeOFF'}>
                <EventBusyOutlinedIcon fontSize="small" />
                <span className="ms-2">Cancelled</span>
              </Link>
            </li>

            <li>
              <Link to="/pages/patients" className={activeNav === 'Patients' ? 'activeON' : 'activeOFF'}>
                <PeopleOutlinedIcon fontSize="small" />
                <span className="ms-2">My Patients</span>
              </Link>
            </li>
            {userRole === 'admin' && (
              <li>
                <Link to="/pages/history" className={activeNav === 'History' ? 'activeON' : 'activeOFF'}>
                  <UpdateOutlinedIcon fontSize="small" />
                  <span className="ms-2">History</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
