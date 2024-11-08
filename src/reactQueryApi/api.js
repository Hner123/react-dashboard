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

const sendReschedForm = async ({ id, selectedBranch, service, date, time, serviceDuration, title }) => {
  const response = await axios.post(process.env.REACT_APP_CALENDARRESCHED, {
    id,
    selectedBranch,
    service,
    date,
    time,
    serviceDuration,
    title,
  });
  return response.data;
};

const fetchPatientBooking = async () => {
  const response = await axios.post(process.env.REACT_APP_CALENDARBOOKING);
  return response.data;
};

const dragNdropResched = async ({ id, date, time, duration, name }) => {
  const response = await axios.post(process.env.REACT_APP_DRAGNDROPRESCHED, { id, date, time, duration, name });
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

const fetchCategoryService = async () => {
  const response = await axios.post(process.env.REACT_APP_FETCHSERVICELIST);
  return response.data;
};

const addservicefunction = async ({ service, duration, categoryID }) => {
  const response = await axios.post(process.env.REACT_APP_ADDSERVICE, { service, duration, categoryID });
  return response.data;
};
const deleteServiceId = async ({ deleteID, serviceName }) => {
  const response = await axios.post(process.env.REACT_APP_DELETESERVICE, { deleteID, serviceName });
  return response.data;
};

const editService = async ({ id, service, duration }) => {
  const response = await axios.post(process.env.REACT_APP_EDITSERVICE, { id, service, duration });
  return response.data;
};

const addCategoryfunction = async ({ category }) => {
  const response = await axios.post(process.env.REACT_APP_ADDCATEGORY, { category });
  return response.data;
};
const deleteCategory = async ({ id }) => {
  const response = await axios.post(process.env.REACT_APP_DELETECATEGORY, { id });
  return response.data;
};

const editCategoryName = async ({ categoryID, categoryN }) => {
  const response = await axios.post(process.env.REACT_APP_EDITCATEGORYNAME, { categoryID, categoryN });
  return response.data;
};

const addNewLocation = async ({ branch, location }) => {
  const response = await axios.post(process.env.REACT_APP_ADDNEWBRANCH, { branch, location });
  return response.data;
};

const deleteLocation = async ({ id, branchLoc }) => {
  const response = await axios.post(process.env.REACT_APP_DELETEBRANCH, { id, branchLoc });
  return response.data;
};

const deletePatientArray = async ({ selected }) => {
  const response = await axios.post(process.env.REACT_APP_DELETEPATIENTARRAY, { selected });
  return response.data;
};

const deleteBooking = async ({ id }) => {
  const response = await axios.post(process.env.REACT_APP_DELETEBOOKING, { id });
  return response.data;
};

export {
  deletePatientArray,
  deleteLocation,
  addNewLocation,
  editCategoryName,
  deleteCategory,
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
  fetchCategoryService,
  addservicefunction,
  deleteServiceId,
  editService,
  addCategoryfunction,
  deleteBooking,
};
