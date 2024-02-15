import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Booking from "./pages/Booking";

const App = () => {
  return (
    // <Login />

    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pages/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
};

export default App;
