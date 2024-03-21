import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../style/patientDetails.css";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

export default function PatientDetails() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");
  const [registeredData, setRegisteredDate] = useState("");
  const [history, setHistory] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const fetchPatientData = async () => {
    try {
      const data = { id };
      const response = await axios.post(
        process.env.REACT_APP_PATIENTDATA,
        data
      );
      setHistory(response.data.patient_history);
      console.log(
        "Fetch patient data successful:",
        response.data.patient_history
      );
      setName(response.data.patientData[0][1]);
      setLastName(response.data.patientData[0][2]);
      setEmail(response.data.patientData[0][5]);
      setGender(response.data.patientData[0][7]);
      setBirth(response.data.patientData[0][3]);
      setPhoneNum(response.data.patientData[0][6]);
      setAddress(response.data.patientData[0][4]);
      setRegisteredDate(response.data.patientData[0][9]);
    } catch (error) {
      console.log("Error fetching patient deta :", error);
    }
  };

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log("dashboard " + sidePanelOPen);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />
      <div className="patientDetailsPage">
        <h1>
          <Link to="/pages/patients">My Patients </Link>
          <KeyboardArrowRightIcon /> <span>{name + " " + lastName} </span>
        </h1>
        <div className="patientInfo">
          <div className="row">
            <div className="col-md-3">
              <div className="row d-flex justify-content-center">
                <div className="patientImage">
                  <img
                    src="https://res.cloudinary.com/djyf3qi4d/image/upload/v1711030283/nerkyot_tc84mg.png"
                    alt=""
                  />
                </div>
                <h1 className="text-center mt-3">{name + " " + lastName}</h1>
                <span className="text-center">{email}</span>
              </div>
            </div>
            <div className="col-md-5">
              <div className="row">
                <div className="col-md">
                  <div>
                    <span>Gender</span>
                    <p>{gender}</p>
                  </div>
                </div>
                <div className="col-md">
                  <div>
                    <span>Birthday</span>
                    <p>{formatDate(birth)}</p>
                  </div>
                </div>
                <div className="col-md">
                  <div>
                    <span>Phone Number</span>
                    <p>{phoneNum}</p>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md">
                  <div>
                    <span>Address</span>
                    <p>{address}</p>
                  </div>
                </div>
                <div className="col-md">
                  <div>
                    <span>Registered Date</span>
                    <p>{formatDate(registeredData)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md notes">
              <p>Notes</p>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-8 patient-history">
              <p>Patients History Treatment</p>
              <div className="bg-history">
                {history?.length > 0 ? (
                  <div>
                    {history.map((histor) => (
                      <div className="history mb-3">{histor[1]}</div>
                    ))}
                  </div>
                ) : (
                  <div className="history mb-3">No found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
