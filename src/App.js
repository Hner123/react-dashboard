import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Booking from './pages/Booking';
import Confirm from './pages/Confirm';
import Cancelled from './pages/Cancelled';
import History from './pages/History';
import Patients from './pages/Patients';
import PatientDetails from './pages/Patient-Details';
import Profile from './pages/Profile';
import Calendar from './components/Calendar';
import MuiCalendar from './components/MuiCalendar';
import CalendarPage from './pages/CalendarPage';
import ForTest from './ForTest';
import ServiceSetup from './pages/ServiceSetup';
import LocationSetup from './pages/LocationSetup/LocationSetup';
import Services from './pages/Services/Services';

const App = () => {
  return (
    // <Login />

    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pages/booking" element={<Booking />} />
        <Route path="/pages/confirm" element={<Confirm />} />
        {/* <Route path="/pages/cancelled" element={<Cancelled />} /> */}
        {/* <Route path="/pages/history" element={<History />} /> */}
        <Route path="/pages/patients" element={<Patients />} />
        <Route path="/pages/patients/patient-details" element={<PatientDetails />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/pages/calendar" element={<Calendar />} /> */}
        <Route path="/pages/muicalendar" element={<MuiCalendar />} />
        <Route path="/pages/calendar" element={<CalendarPage />} />
        <Route path="/pages/fortesting" element={<ForTest />} />
        <Route path="/pages/service-setup" element={<ServiceSetup />} />
        <Route path="/pages/location-setup" element={<LocationSetup />} />
        <Route path="/pages/services" element={<Services />} />
      </Routes>
    </Router>
  );
};

export default App;
