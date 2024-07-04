import '../style/sidepanel.css';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import PlaylistAddCheckCircleOutlinedIcon from '@mui/icons-material/PlaylistAddCheckCircleOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { styled } from '@mui/system';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MyContext from '../MyContext';
import { useLocation } from 'react-router-dom';
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

  const location = useLocation();

  const { dropDown, setDropDown, activePanel, setActivePanel } = useContext(MyContext);

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

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/pages/calendar') {
      setActivePanel('Calendar');
    } else if (currentPath === '/dashboard') {
      setActivePanel('Dashboard');
    } else if (currentPath === '/pages/service-setup') {
      setActivePanel('ServiceSetup');
    } else if (currentPath === '/pages/patients') {
      setActivePanel('Patients');
    } else if (currentPath === '/pages/location-setup') {
      setActivePanel('LocationSetup');
    } else if (currentPath === '/pages/services') {
      setActivePanel('Services');
    }
  }, [location]);

  return (
    <div>
      <div className={isOpen ? 'overlay hide' : 'overlay show'} onClick={togglePanel}></div>

      <div className={isOpen ? 'sidePanel hide' : 'sidePanel show'}>
        <div className="sidePanelList">
          <ul>
            <li className={activePanel === 'Dashboard' ? 'activeON' : ''}>
              <Link to="/dashboard">
                <DashboardOutlinedIcon fontSize="small" />
                <span className="ms-2">Dashboard</span>
              </Link>
            </li>

            <li className={activePanel === 'Calendar' ? 'activeON' : ''}>
              <Link to="/pages/calendar">
                <EventBusyOutlinedIcon fontSize="small" />
                <span className="ms-2">Calendar</span>
              </Link>
            </li>

            <li className={activePanel === 'ServiceSetup' ? 'activeON' : ''}>
              <Link
                to="/pages/service-setup"
                onClick={() => {
                  setDropDown(!dropDown);
                }}
              >
                <EventBusyOutlinedIcon fontSize="small" />
                <span className="ms-2">
                  Service Setup <ExpandMore sx={{ fontSize: '20px !important', position: 'absolute', right: '15px' }} />
                </span>
              </Link>
            </li>
            <Collapse in={dropDown} timeout="auto" unmountOnExit>
              <ul className="serviceCollapse">
                <li className={activePanel === 'Services' ? 'activeON' : ''}>
                  <Link to="/pages/services">Services</Link>
                </li>
                <li className={activePanel === 'LocationSetup' ? 'activeON' : ''}>
                  <Link to="/pages/location-setup">Location</Link>
                </li>
              </ul>
            </Collapse>

            <li className={activePanel === 'Patients' ? 'activeON' : ''}>
              <Link to="/pages/patients">
                <PeopleOutlinedIcon fontSize="small" />
                <span className="ms-2">My Patients</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
