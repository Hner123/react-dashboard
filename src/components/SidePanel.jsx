import '../style/sidepanel.css';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import PlaylistAddCheckCircleOutlinedIcon from '@mui/icons-material/PlaylistAddCheckCircleOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

export default function SidePanel({ isOpen, togglePanel, activeNav }) {
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
                <span className="ms-2">Booking</span>
              </Link>
            </li>
            <li>
              <Link to="/pages/confirm" className={activeNav === 'Confirm' ? 'activeON' : 'activeOFF'}>
                <PlaylistAddCheckCircleOutlinedIcon fontSize="small" />
                <span className="ms-2">Confirm</span>
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
            <li>
              <Link to="/pages/history" className={activeNav === 'History' ? 'activeON' : 'activeOFF'}>
                <UpdateOutlinedIcon fontSize="small" />
                <span className="ms-2">History</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
