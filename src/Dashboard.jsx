import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import SidePanel from "./components/SidePanel";
import "./style/dashboad.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import DataTable from "datatables.net-bs5";
// import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
import AmChart from "./components/AmChart";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
// import faker from "faker";
import { Person } from "@mui/icons-material";
import { EventNote } from "@mui/icons-material";
import { GroupAdd } from "@mui/icons-material";

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
  const [test, setTest] = useState([]);
  const [active, setActive] = useState("Dashboard");
  const [todayPatientsValue, setTodayPatientsValue] = useState(0);

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log("dashboard " + sidePanelOPen);
  };

  const handleStatusData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_DATA);
      console.log("Post successful:", response.data);

      setTodayPatientsValue(response.data.percentage_Patients_vs_yesterday);

      const filteredEvents = [];
      for (let i = 0; i < response.data.ConfirmAllBooking.length; i++) {
        if (response.data.allLocationBranch[i] === "Marikina") {
          filteredEvents.push({
            title: response.data.ConfirmAllNames[i],
            start: response.data.ConfirmAllBooking[i] + " " + response.data.ConfirmAlltimes[i],
          });
        }
      }

      setEvents(filteredEvents);

      SetData(response.data.responselast30daysRange);
      SetTotalPatient(response.data.totalPatient);
      SetTotalAppointments(response.data.totalAppointment);
      SetTotalSales(response.data.totalSales);
      SetTodayPatient(response.data.todayPatient);
      // SetConfirmnames(response.data.sample);
      // SetConfirmSched(response.data.ConfirmAllBooking);
      console.log("TEST KO RA  " + dataq);

      // console.log(tableRef.current);
      // new DataTable('#example', {

      const table = new DataTable("#myTable", {
        data: response.data.upComingPatient,
        columns: [{ title: "Schedule" }, { title: "Name" }],

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
        console.log("Table destroyed");
        table.destroy();
        console.log("events to" + events);
      };
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setPreload(false);
    }
  };

  const filterCalendarLoc = async (loc) => {
    try {
      const response = await axios.post(process.env.REACT_APP_DATA);
      console.log("Post successful:", response.data);

      const filteredEvents = [];
      for (let i = 0; i < response.data.ConfirmAllBooking.length; i++) {
        if (response.data.allLocationBranch[i] === loc) {
          filteredEvents.push({
            title: response.data.ConfirmAllNames[i],
            start: response.data.ConfirmAllBooking[i] + " " + response.data.ConfirmAlltimes[i],
          });
        }
      }

      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  useEffect(() => {
    handleStatusData();
    // console.log("dataSet daya " + data);
    console.log("events to" + events);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Trend Sales",
      },
    },
  };

  const weeklySalesData = {
    // labels,
    datasets: [
      // {\
      //   label: "Dataset 1",
      //   data: {
      //     "2024-01-19": "2000",
      //     "2024-01-28": "2000",
      //     "2024-01-29": "1000",
      //   },
      //   backgroundColor: "rgba(255, 99, 132, 0.5)",
      // },
      {
        label: "Current Week",
        data: dataq,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  return (
    <div className="dash">
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />
      <div>
        <div className="dashboard">
          <h5>Dashboard</h5>

          {/* ****************************4 BOX STATS************************ */}
          <div className="stats d-flex justify-content-center">
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
                      class="bi bi-caret-down-fill"
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
                      class="bi bi-caret-up-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                    </svg>
                    {todayPatientsValue}% vs Yesterday
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
                    class="bi bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  12% vs Yesterday
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
                    class="bi bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  12% vs Yesterday
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
                  <span
                    className="d-flex justify-content-center align-items-center mb-3 statsRed"
                    style={{ fontSize: "26px", fontWeight: "500" }}
                  >
                    ₱
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
                    class="bi bi-caret-up-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  12% vs Yesterday
                </span>
              </div>
            </div>
          </div>
          {/* **************************upcoming Table********************** */}
          <div className="upcomingPatient d-flex justify-content-center">
            <div className="col-md">
              <p>Upcoming Appointments</p>
              <table id="myTable" className="row-border"></table>
            </div>
            <div className="col-md-7 weeklyChart">
              <Bar options={options} data={weeklySalesData} />
            </div>
          </div>
          <div className="fullCalendar">
            <div className="d-flex justify-content-center">
              <div className="col-md-6 d-flex justify-content-center">
                <button onClick={() => filterCalendarLoc("Marikina")} className="btn btn-primary btn-sm me-5">
                  Marikina
                </button>
                <button onClick={() => filterCalendarLoc("Antipolo")} className="btn btn-primary btn-sm">
                  Antipolo
                </button>
              </div>
            </div>
            <div className="callendarSize">
              <FullCalendar
                initialDate={formattedDate}
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                navLinks={true}
                dayMaxEventRows={true}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                slotMinTime="10:00:00"
                slotMaxTime="19:00:00"
                // weekends={false}
                events={events}
                eventContent={renderEventContent}
              />
            </div>
          </div>
          <div className="amChart">
            <h5>Sales for the last 30 days till now</h5>
            <AmChart />
          </div>
        </div>
      </div>
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
