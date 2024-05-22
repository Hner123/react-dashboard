import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import '../style/patientDetails.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Modal from 'react-bootstrap/Modal';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import 'react-datepicker/dist/react-datepicker.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

export default function PatientDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [address, setAddress] = useState('');
  const [registeredData, setRegisteredDate] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [history, setHistory] = useState([]);
  const [profilePic, setProfilePic] = useState('');
  const [pic, setPic] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModaladdFiles, setshowModaladdFiles] = useState(false);
  const [addFile, setAddFile] = useState('');
  const [documents, setDocuments] = useState([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [notesHistoryModal, setNotesHistoryModal] = useState(false);
  const [noteInsideModal, setNoteInsideModal] = useState('None');
  const [deleteID, setDeleteID] = useState(0);
  const [openS, setOPenS] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('');
  const [editPatient, setEditPatient] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [validated, setValidated] = useState(false);

  const [patientName, setPatientName] = useState('');
  const [patientLastname, setPatientLastname] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientPhone, setPatientPhone] = useState(null);
  const [patientEmail, setPatientEmail] = useState('');
  const [patientDOB, setPatientDOB] = useState('');
  const [preload, setPreload] = useState(true);
  const [active, setActive] = useState('Patients');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  const showModalFunction = () => setShowModal(true);
  const addFilesModal = () => setshowModaladdFiles(true);

  const deleteFilesModal = (docu_id) => {
    setDeleteID(docu_id);
    setShowModalDelete(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setshowModaladdFiles(false);
    setShowModalDelete(false);
    setNotesHistoryModal(false);
    setEditPatient(false);
    setValidated(false);
  };

  const fetchPatientData = async () => {
    try {
      const data = { id };
      const response = await axios.post(process.env.REACT_APP_PATIENTDATA, data);
      setHistory(response.data.patient_history);
      console.log('Fetch patient data successful:', response.data.patientData);
      setName(response.data.patientData[0][1]);
      setLastName(response.data.patientData[0][2]);
      setEmail(response.data.patientData[0][5]);
      setGender(response.data.patientData[0][7]);
      setBirth(response.data.patientData[0][3]);
      setPhoneNum(response.data.patientData[0][6]);
      setAddress(response.data.patientData[0][4]);
      setRegisteredDate(response.data.patientData[0][10]);
      setClientNotes(response.data.patientData[0][8]);
      setPic(response.data.patientData[0][9]);
      setDocuments(response.data.patient_attachement_file);

      setPatientName(response.data.patientData[0][1]);
      setPatientLastname(response.data.patientData[0][2]);
      setPatientGender(response.data.patientData[0][7]);
      setPatientAddress(response.data.patientData[0][4]);
      setPatientPhone(response.data.patientData[0][6]);
      setPatientEmail(response.data.patientData[0][5]);
      setPatientDOB(response.data.patientData[0][3]);
    } catch (error) {
      console.log('Error fetching patient deta :', error);
    } finally {
      setPreload(false);
    }
  };

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log('dashboard ' + sidePanelOPen);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const extractTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const period = hours >= 12 ? 'AM' : 'PM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
    return `${hours}:${minutes}:${seconds} ${period}`;
  };

  const addNotes = (event) => {
    setClientNotes(event.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };
  const handleAddFile = (e) => {
    const file = e.target.files[0];
    setAddFile(file);
  };

  const saveNotes = async () => {
    try {
      setIsLoading(true);
      const data = {
        id,
        clientNotes,
      };
      const response = await axios.post(process.env.REACT_APP_ADDNOTES, data);
      console.log('Successfully added notes :', response.data);
      setOPenS(true);
      setSnackMessage('Notes has been saved!');
      setSnackSeverity('success');
    } catch (error) {
      console.log('Error saving notes :', error);
      setOPenS(true);
      setSnackMessage('Error saving notes!');
      setSnackSeverity('error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfilePic = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('profilePic', profilePic);
      formData.append('id', id);

      const response = await axios.post(process.env.REACT_APP_EDITPROFILEPIC, formData);
      const data = { id };
      const response2 = await axios.post(process.env.REACT_APP_PATIENTDATA, data);
      setPic(response2.data.patientData[0][9]);

      handleClose();
      console.log('Successfully send data :', response.data, response2.data.patientData[0][9]);
    } catch (error) {
      console.log('Error saving profile pic :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocument = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('addFile', addFile);
      formData.append('id', id);

      const response = await axios.post(process.env.REACT_APP_ADD_DOCUMENT, formData);
      const data = { id };
      const response2 = await axios.post(process.env.REACT_APP_PATIENTDATA, data);
      setDocuments(response2.data.patient_attachement_file);
      handleClose();

      console.log('Successfully send data :', response.data);
    } catch (error) {
      console.log('Error saving profile pic :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocu = async () => {
    try {
      setIsLoading(true);
      const data = { deleteID };
      const response = await axios.post(process.env.REACT_APP_DELETEDOCUMENT, data);
      const data2 = { id };
      const response2 = await axios.post(process.env.REACT_APP_PATIENTDATA, data2);
      setDocuments(response2.data.patient_attachement_file);
      handleClose();
      console.log('Successfully deleted the file: ' + response.data);
    } catch (error) {
      console.log('Error Delete the file :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOPenS(false);
  };

  const handleSubmit = async (event) => {
    console.log('this button was click');
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (
      patientName != '' &&
      patientLastname != '' &&
      patientGender != '' &&
      patientAddress != '' &&
      patientPhone != '' &&
      patientEmail != '' &&
      patientDOB != ''
    ) {
      try {
        const data = {
          id,
          patientName,
          patientLastname,
          patientGender,
          patientAddress,
          patientPhone,
          patientEmail,
          patientDOB,
        };
        const data2 = { id };

        const response = await axios.post(process.env.REACT_APP_EDITPATIENTDETAILS, data);
        console.log('Saving edited details :' + response.data);

        const response2 = await axios.post(process.env.REACT_APP_PATIENTDATA, data2);
        setName(response2.data.patientData[0][1]);
        setLastName(response2.data.patientData[0][2]);
        setEmail(response2.data.patientData[0][5]);
        setGender(response2.data.patientData[0][7]);
        setBirth(response2.data.patientData[0][3]);
        setPhoneNum(response2.data.patientData[0][6]);
        setAddress(response2.data.patientData[0][4]);

        handleClose();
        setOPenS(true);
        setSnackSeverity('success');
        setSnackMessage('Patient details updated!');
      } catch (error) {
        setOPenS(true);
        setSnackSeverity('error');
        setSnackMessage('Error updating patient details!');
        console.log('Error saving edited patient details :', error);
      }
    } else {
      console.log('You need to fill out all the fields first.');
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />
      <div className="patientDetailsPage">
        <div className="d-flex justify-content-between">
          <h1>
            <Link to="/pages/patients">My Patients </Link>
            <KeyboardArrowRightIcon /> <span>{name + ' ' + lastName} </span>
          </h1>
          <button
            style={{ fontSize: '11px' }}
            className="editPatientBtn px-3"
            onClick={() => setEditPatient(true)}
          >
            <BorderColorIcon fontSize="small" />
            Edit Patient
          </button>
        </div>

        <div className="patientInfo">
          <div className="row">
            {/* **********************************PROFILE PIC and NAME************************************** */}
            <div className="col-md-3">
              <div className="row d-flex justify-content-center">
                <div
                  className="patientImage"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {pic == '' || pic == null ? (
                    <img src={process.env.REACT_APP_BLANKPROFILE} />
                  ) : (
                    <img
                      src={process.env.REACT_APP_LINKPROFILE + pic}
                      alt=""
                      style={{ opacity: isHovered ? 0.5 : 1 }}
                    />
                  )}

                  <div className="cameraIcon" style={{ visibility: isHovered ? 'visible' : 'hidden' }}>
                    <IconButton className="Edit-profile-pic" onClick={showModalFunction}>
                      <PhotoCameraIcon />
                    </IconButton>
                  </div>
                </div>
                <h1 className="text-center mt-3">{name + ' ' + lastName}</h1>

                <span className="text-center">{email}</span>
              </div>
            </div>
            {/* **********************************CUSTOMER DETAILS************************************** */}
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
            {/* **********************************CUSTOMER NOTES************************************** */}
            <div className="col-md notes">
              <p className="mb-2">Notes</p>
              <div className="notesfield">
                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                  <Form.Control
                    className="txtArea"
                    as="textarea"
                    rows={8}
                    value={clientNotes}
                    onChange={addNotes}
                  />
                </Form.Group>
              </div>
              <div className="d-flex justify-content-end">
                <Button size="sm" variant="primary" disabled={isLoading} onClick={saveNotes}>
                  <Spinner
                    style={{ display: isLoading ? 'inline-block' : 'none', height: '12px', width: '12px' }}
                    animation="border"
                    size="sm"
                  />
                  &nbsp;
                  {isLoading ? 'Adding...' : 'Add Note'}
                </Button>
              </div>
            </div>
          </div>
          {/* **********************************Patients History Treatment************************************** */}
          <div className="row mt-3">
            <div className="col-md-8 patient-history">
              <p>Patient History Treatment</p>
              <div className="bg-history">
                {history?.length > 0 ? (
                  <div className="hs">
                    {history.map((histor, index) => (
                      <div className="history mb-3" key={index}>
                        <div className="row">
                          <div className="col-md d-flex align-items-center justify-content-center">
                            <div>
                              <p className="m-0 text-center">{formatDate(histor[3])}</p>
                              <span className="d-flex justify-content-center">{extractTime(histor[3])}</span>
                            </div>
                          </div>
                          <div className="col-md">
                            <span>Procedures</span>
                            <p className="m-0">{histor[1]}</p>
                          </div>
                          <div className="col-md">
                            <span>Paid</span>
                            <p>&#8369;{histor[2]}</p>
                          </div>
                          <div className="col-md d-flex align-items-center">
                            {histor[4] == '' ? (
                              <span style={{ color: '#6c757d7a' }}>
                                <SpeakerNotesIcon fontSize="small" /> Notes
                              </span>
                            ) : (
                              <span
                                onClick={() => {
                                  setNotesHistoryModal(true);
                                  setNoteInsideModal(histor[4]);
                                }}
                                style={{ color: '#2266D7', cursor: 'pointer' }}
                              >
                                <SpeakerNotesIcon fontSize="small" /> Notes
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="history_timeline"></span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-3">
                    <h4 className="text-center mt-5" style={{ color: '#6c757d7a' }}>
                      <img style={{ width: '37%' }} src={process.env.REACT_APP_NODATAIMAGE} alt="" />
                    </h4>
                  </div>
                )}
              </div>
            </div>
            {/* **********************************Patients Document/file************************************** */}
            <div className="col-md attachment">
              <div className="row mb-2">
                <div className="col-md">
                  <p className="m-0">Documents / file</p>
                </div>
                <div className="col-md d-flex justify-content-end">
                  <button onClick={addFilesModal} id="addFilesBtn">
                    <AddCircleOutlineIcon sx={{ fontSize: 18, marginRight: '5px' }} />
                    Add Files
                  </button>
                </div>
              </div>

              <div>
                {documents?.length > 0 ? (
                  <div>
                    {documents.map((document, index) => (
                      <div
                        className="documents"
                        key={index}
                        onMouseEnter={() => setIsHovered2(index)}
                        onMouseLeave={() => setIsHovered2(null)}
                      >
                        <span>
                          <div className="row">
                            <div className="col-md-9" key={index}>
                              <DescriptionIcon sx={{ fontSize: 14, marginRight: '7px' }} />
                              {document[0]}
                            </div>

                            <div className="kb col-md d-flex justify-content-end">
                              <div
                                style={{
                                  display: isHovered2 === index ? 'none' : 'block',
                                  fontWeight: 'initial',
                                }}
                                key={index}
                              >
                                {document[1]}
                              </div>

                              <div
                                style={{
                                  display: isHovered2 === index ? 'block' : 'none',
                                }}
                              >
                                <DeleteIcon
                                  onClick={() => {
                                    deleteFilesModal(document[3]);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                  sx={{ fontSize: 12, marginRight: '7px' }}
                                />

                                <a href={process.env.REACT_APP_LINKPROFILE + document[2]} target="_blank">
                                  <GetAppIcon
                                    style={{ cursor: 'pointer' }}
                                    className="mt-1"
                                    sx={{ fontSize: 12 }}
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-center mt-5" style={{ color: '#6c757d7a' }}>
                      No documents
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* **********************************Modal for Uploading of profile pic************************************** */}
      <Modal
        size="sm"
        show={showModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <p className="mb-0">Change photo</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFileSm" className="mb-3">
              <Form.Label>Upload a photo</Form.Label>
              <Form.Control type="file" size="sm" onChange={handleFileChange} accept="image/*" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" disabled={isLoading} onClick={saveProfilePic}>
            <Spinner style={{ display: isLoading ? 'inline-block' : 'none' }} animation="border" size="sm" />{' '}
            &nbsp;
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>

          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* **********************************Modal for Uploading Documents************************************** */}
      <Modal
        size="sm"
        show={showModaladdFiles}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <p className="mb-0">Add a file </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFileSm" className="mb-3">
              <Form.Label>Upload your file here.</Form.Label>
              <Form.Control type="file" size="sm" onChange={handleAddFile} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" disabled={isLoading} onClick={saveDocument}>
            <Spinner style={{ display: isLoading ? 'inline-block' : 'none' }} animation="border" size="sm" />{' '}
            &nbsp;
            {isLoading ? 'Saving...' : 'Save'}
          </Button>

          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* **********************************Modal for Deleting Documents************************************** */}
      <Modal
        size="sm"
        show={showModalDelete}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <p className="mb-0">Delete a file </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFileSm">
              <Form.Label>Are you sure you want to delete the file?</Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" disabled={isLoading} onClick={deleteDocu}>
            <Spinner style={{ display: isLoading ? 'inline-block' : 'none' }} animation="border" size="sm" />{' '}
            &nbsp;
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>

          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* **********************************Modal for Viewing notes each history treatment************************************** */}
      <Modal
        size="sm"
        show={notesHistoryModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Note </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFileSm">
              <Form.Label>{noteInsideModal}</Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* **********************************Modal for EDIT PATIENT DETAILS************************************** */}
      <Modal
        size="lg"
        show={editPatient}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Edit Patient </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <EditPatientDetails /> */}

          <Form id="EditPatientForm" noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom01">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="First name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Please enter a name.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom02">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Last name"
                  value={patientLastname}
                  onChange={(e) => setPatientLastname(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Please enter a last name.</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom03">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  required
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Please provide a valid address.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom04">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Please provide an email.</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="3" controlId="validationCustom05">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  required
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                >
                  <option disabled>Select ---</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">Please select a gender.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom06">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Phone number"
                  required
                  value={patientPhone}
                  onChange={(e) => {
                    setPatientPhone(e.target.value);
                  }}
                />
                <Form.Control.Feedback type="invalid">Please provide a phone number.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom07">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  placeholder=""
                  required
                  value={patientDOB}
                  onChange={(e) => setPatientDOB(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Please select your birth date.</Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Form>
          {/* ********************************* */}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" form="EditPatientForm">
            Save changes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* **********************************SnackBAR notif************************************** */}
      <Snackbar
        open={openS}
        autoHideDuration={2000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnack} severity={snackSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
