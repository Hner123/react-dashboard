import axios from 'axios';

const fetchPatientList = async () => {
  const response = await axios.post(process.env.REACT_APP_TYPEHEAD);
  return response.data.Patients;
};

const fetchBranchList = async () => {
  const response = await axios.post(process.env.REACT_APP_BRANCHLIST);
  return response.data;
};

const fetchServiceList = async () => {
  const response = await axios.post(process.env.REACT_APP_SERVICELIST);
  return response.data;
};

const fetchTimeList = async ({ dateSelected, selectedBranch }) => {
  const response = await axios.post(process.env.REACT_APP_FETCHTIMELIST, { dateSelected, selectedBranch });
  return response.data;
};

const sendNewBookingForm = async ({ firstName, lastName, emailAdd, phoneNum, selectedBranch, service, serviceDuration, date, time, notes }) => {
  const response = await axios.post(process.env.REACT_APP_SENDNEWBOOKINGFORM, {
    firstName,
    lastName,
    emailAdd,
    phoneNum,
    selectedBranch,
    service,
    serviceDuration,
    date,
    time,
    notes,
  });
  return response.data;
};

const sendReschedForm = async ({ id, selectedBranch, service, date, time, serviceDuration }) => {
  const response = await axios.post(process.env.REACT_APP_CALENDARRESCHED, {
    id,
    selectedBranch,
    service,
    date,
    time,
    serviceDuration,
  });
  return response.data;
};

const fetchPatientBooking = async () => {
  const response = await axios.post(process.env.REACT_APP_CALENDARBOOKING);
  return response.data;
};

const dragNdropResched = async ({ id, date, time, duration }) => {
  const response = await axios.post(process.env.REACT_APP_DRAGNDROPRESCHED, { id, date, time, duration });
  return response.data;
};

const rQuerySetstatus = async ({ id, status }) => {
  const response = await axios.post(process.env.REACT_APP_CHANGESTATUS, { id, status });
  return response.data;
};

const processPayment = async ({ name, lastName, servicesP, price, assisted, notes, id }) => {
  const response = await axios.post(process.env.REACT_APP_PROCESSPAYMENT, { name, lastName, servicesP, price, assisted, notes, id });
  return response.data;
};

const resEditPatientDetails = async ({ id, name, lastname, email, phoneNumber }) => {
  const response = await axios.post(process.env.REACT_APP_RESEDITPATIENTDETAILS, { id, name, lastname, email, phoneNumber });
  return response.data;
};

export {
  rQuerySetstatus,
  dragNdropResched,
  fetchPatientList,
  fetchBranchList,
  fetchServiceList,
  fetchTimeList,
  sendNewBookingForm,
  fetchPatientBooking,
  sendReschedForm,
  processPayment,
  resEditPatientDetails,
};
