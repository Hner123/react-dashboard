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
import { styled } from '@mui/system';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Button,
  Box,
  Typography,
  ListItemIcon,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Collapse,
} from '@mui/material';
import { color } from 'framer-motion';

export default function SidePanel({ isOpen, togglePanel, activeNav, acceptBooking }) {
  const [notif, setNotif] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [dropDown, setDropDown] = useState(false);

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
            <li className={activeNav === 'Dashboard' ? 'activeON' : 'activeOFF'}>
              <Link to="/dashboard">
                <DashboardOutlinedIcon fontSize="small" />
                <span className="ms-2">Dashboard</span>
              </Link>
            </li>

            {/* <li className={activeNav === 'Booking' ? 'activeON' : 'activeOFF'}>
              <Link to="/pages/booking" >
                <DateRangeOutlinedIcon fontSize="small" />
                <span className="ms-2" style={{ position: 'relative' }}>
                  Booking
                  {notif === 0 ? null : <span className="bookingNotif">{notif}</span>}
                </span>
              </Link>
            </li> */}
            {/* <li className={activeNav === 'Confirm' ? 'activeON' : 'activeOFF'}>
              <Link to="/pages/confirm" >
                <PlaylistAddCheckCircleOutlinedIcon fontSize="small" />
                <span className="ms-2">Confirm</span>
              </Link>
            </li> */}

            <li className={activeNav === 'Calendar' ? 'activeON' : 'activeOFF'}>
              <Link to="/pages/calendar">
                <EventBusyOutlinedIcon fontSize="small" />
                <span className="ms-2">Calendar</span>
              </Link>
            </li>

            <li className={activeNav === 'ServiceSetup' ? 'activeON' : 'activeOFF'} onClick={() => setDropDown(!dropDown)}>
              <Link to="/pages/service-setup">
                <EventBusyOutlinedIcon fontSize="small" />
                <span className="ms-2">
                  Service Setup <ExpandMore sx={{ fontSize: '20px !important', position: 'absolute', right: '15px' }} />
                </span>
              </Link>
            </li>
            <Collapse in={dropDown} timeout="auto" unmountOnExit>
              <ul className="serviceCollapse">
                <li className={activeNav === 'ServiceSetup' ? 'activeON' : 'activeOFF'}>Services</li>
                <li>Location</li>
              </ul>
            </Collapse>

            {/* <li className={activeNav === 'Cancelled' ? 'activeON' : 'activeOFF'}>
              <Link to="/pages/cancelled" >
                <EventBusyOutlinedIcon fontSize="small" />
                <span className="ms-2">Cancelled</span>
              </Link>
            </li> */}

            <li className={activeNav === 'Patients' ? 'activeON' : 'activeOFF'}>
              <Link to="/pages/patients">
                <PeopleOutlinedIcon fontSize="small" />
                <span className="ms-2">My Patients</span>
              </Link>
            </li>
            {/* {userRole === 'admin' && (
              <li className={activeNav === 'History' ? 'activeON' : 'activeOFF'}>
                <Link to="/pages/history" >
                  <UpdateOutlinedIcon fontSize="small" />
                  <span className="ms-2">History</span>
                </Link>
              </li>
            )} */}
          </ul>
        </div>
      </div>
    </div>
  );
}
