import "../style/sidepanel.css";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import PlaylistAddCheckCircleOutlinedIcon from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

export default function SidePanel({ isOpen, togglePanel }) {
  const navigate = useNavigate();

  return (
    <div>
      <div
        className={isOpen ? "overlay hide" : "overlay show"}
        onClick={togglePanel}
      ></div>

      <div className={isOpen ? "sidePanel hide" : "sidePanel show"}>
        <div className="sidePanelList">
          <ul>
            <Link to="/dashboard">
              <li>
                <DashboardOutlinedIcon fontSize="small" />
                <span className="ms-2">Dashboard</span>
              </li>
            </Link>

            <li>
              <Link to="/pages/booking">
                <DateRangeOutlinedIcon fontSize="small" />
                <span className="ms-2">Booking</span>
              </Link>
            </li>
            <li>
              <Link to="/pages/confirm">
                <PlaylistAddCheckCircleOutlinedIcon fontSize="small" />
                <span className="ms-2">Confirm</span>
              </Link>
            </li>
            <li>
              <Link to="/pages/cancelled">
                <EventBusyOutlinedIcon fontSize="small" />
                <span className="ms-2">Cancelled</span>
              </Link>
            </li>
            <li>
              <Link to="/pages/patients">
                <PeopleOutlinedIcon fontSize="small" />
                <span className="ms-2">My Patients</span>
              </Link>
            </li>
            <li>
              <Link to="/pages/history">
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
