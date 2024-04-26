import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import '../style/confirm.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import DataTable from 'datatables.net-dt';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MaterialUIButton from '@mui/material/Button';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import TypeHead from '../components/TypeHead';
import { Row, Col } from 'react-bootstrap';

// ***************************These both datatables needed for Colvis features********************************
import 'datatables.net-responsive-bs5/js/responsive.bootstrap5.js';
import 'datatables.net-buttons/js/buttons.colVis.mjs';

export default function Confirm() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);
  const [firstRowData, setFirstRowData] = useState(0);
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedModal, setShowReschedModal] = useState(false);

  const [userFound, setUserFound] = useState('');
  const [procedure, setProcedure] = useState('');
  const [paymentCost, setPaymentCost] = useState('');
  const [notes, setNotes] = useState('');
  const [userID, setUserID] = useState();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [reasons, setReasons] = useState('');
  const [preload, setPreload] = useState(true);

  const [openS, setOPenS] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState('');
  const [snackMessage, setSnackMessage] = useState('');

  const [active, setActive] = useState('Confirm');

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log('dashboard ' + sidePanelOPen);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOPenS(false);
  };

  const fetchConfirmData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_CONFIRMLIST);
      console.log('Post successful:', response.data);

      const table = new DataTable('#myTable', {
        data: response.data.DateAndName,
        dom: 'Bfrtip',
        buttons: ['colvis'],
        columns: [
          { title: 'ID' },
          { title: 'Schedule' },
          { title: 'Name' },
          { title: 'Email' },
          { title: 'Phone Number' },
          { title: 'Status' },
          { title: 'Services' },
          { title: 'Branch' },
          { title: 'Notes' },
          {
            title: 'Actions',
            render: function (data, type, row) {
              // Assuming you have access to row data, you can create buttons dynamically
              if (type === 'display') {
                return `
                            <div class='d-flex confirmBtn'>
                                <button class='manageBtn'>Manage</button>
                                <button class='editBtn'>Edit</button>
                                <button class='cancelBtn'>Cancel</button>
                            </div>
                        `;
              }
              return null;
            },
          },
        ],
        createdRow: (row, data) => {
          // Attach event listeners to buttons when rows are created
          $(row)
            .find('.manageBtn')
            .on('click', function () {
              // Retrieve data from the current row
              const rowData = table.row($(this).closest('tr')).data()[0];
              console.log('Data from current row:', rowData);
              handleShow();
              setFirstRowData(rowData);
              fetchCompared(rowData);
            });
          $(row)
            .find('.editBtn')
            .on('click', function () {
              // Retrieve data from the current row
              const rowData = table.row($(this).closest('tr')).data()[0];
              console.log('Data from current row:', rowData);
              showEditModal();
              setFirstRowData(rowData);
              editClient(rowData);
            });
          $(row)
            .find('.cancelBtn')
            .on('click', function () {
              // Retrieve data from the current row
              const rowData = table.row($(this).closest('tr')).data()[0];
              console.log('Data from current row:', rowData);
              cancelModal();
              setFirstRowData(rowData);
            });
        },

        destroy: true, // I think some clean up is happening here
        responsive: true,
        deferRender: true,
        columnDefs: [
          {
            target: 0,
            visible: false,
            searchable: false,
          },
          {
            target: 3,
            visible: false,
            searchable: false,
          },
          { responsivePriority: 1, targets: -1 },
          { responsivePriority: 2, targets: 2 },
        ],
      });
      // Extra step to do extra clean-up.
      return function () {
        console.log('Table destroyed');
        table.destroy();
        console.log('events to' + events);
      };
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setPreload(false);
    }
  };

  const handleShow = () => setShow(true);
  const showEditModal = () => setEditModal(true);
  const cancelModal = () => setShowCancel(true);

  const handleClose = () => {
    setShow(false);
    setShowCancel(false);
    setEditModal(false);
    setShowReschedModal(false);
  };

  const fetchCompared = async (id_num) => {
    try {
      const id = { id_num };

      const response = await axios.post(process.env.REACT_APP_MANAGE, id);
      console.log('Manage data successfully: ', response.data);
      console.log('output ko: ', response.data.UserFound);
      //   handleClose();
      setUserFound(response.data.UserFound);
      setUserID(response.data.User_ID);
    } catch (error) {
      console.log('error fetching from Manage: ', error);
    }
  };

  const Proccessing = async () => {
    try {
      const data = { userID, procedure, paymentCost, firstRowData, notes };

      const response = await axios.post(process.env.REACT_APP_PROCESSPAYMENT, data);
      console.log('processpayment data successfully: ', response.data);
      fetchConfirmData();

      setOPenS(true);
      setSnackMessage('Transaction Completed!');
      setSnackSeverity('success');
      handleClose();
    } catch (error) {
      console.log('error fetching from Manage: ', error);
      setOPenS(true);
      setSnackMessage('Transaction Failed!');
      setSnackSeverity('error');
    }
  };

  const editClient = async (id_num) => {
    try {
      const data = { id_num };

      const response = await axios.post(process.env.REACT_APP_EDITCLIENT, data);
      console.log('EditClient data successfully: ', response.data);
      setName(response.data.First_Name);
      setLastname(response.data.Last_Name);
    } catch (error) {
      console.log('error fetching from EditClient: ', error);
    }
  };

  const cancelBooking = async () => {
    try {
      const dataAccept = { firstRowData, reasons };

      const response = await axios.post(process.env.REACT_APP_SENDCANCELCONFIRMEDATA, dataAccept);
      console.log('Cancel Data successfully: ', response.data);
      fetchConfirmData();
      handleClose();

      setOPenS(true);
      setSnackMessage('Cancelled!');
      setSnackSeverity('success');
    } catch (error) {
      console.log('error fetching from accept confirm page: ', error);
      setOPenS(true);
      setSnackMessage('Error Cancelling!');
      setSnackSeverity('error');
    }
  };

  const updateNameAndLastname = async () => {
    try {
      const data2 = { firstRowData, name, lastname };

      const response2 = await axios.post(process.env.REACT_APP_EDITNAMEANDLASTNAME, data2);
      console.log('update name and lastname :', response2.data);
      fetchConfirmData();
      handleClose();

      setOPenS(true);
      setSnackMessage('Edited Success!');
      setSnackSeverity('success');
    } catch (error) {
      console.log('Update edit and name got an error: ', error);
      setOPenS(true);
      setSnackMessage('Error editing!');
      setSnackSeverity('error');
    }
  };

  const editName = (event) => {
    setName(event.target.value);
  };

  const editLastName = (event) => {
    setLastname(event.target.value);
  };

  const procedures = (event) => {
    setProcedure(event.target.value);
  };

  const cost = (event) => {
    setPaymentCost(event.target.value);
  };
  const reasonsValue = (event) => {
    setReasons(event.target.value);
  };

  const closeManageModal = () => {
    setShow(false);
  };

  const [numberOfDays, setNumberOfDays] = useState([]);
  const generateCalendar = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const numbers = [];
    for (let i = 1; i <= daysInMonth; i++) {
      numbers.push(i);
    }
    setNumberOfDays(numbers);
  };

  useEffect(() => {
    fetchConfirmData();
    generateCalendar();
  }, []);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />

      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} activeNav={active} />

      <div className="confirmPage">
        <div className="d-flex justify-content-between">
          <h1>Confirm</h1>
          <TypeHead />
        </div>

        <div className="confirmTable">
          <table id="myTable" className="row-border" width="100%"></table>
        </div>
      </div>

      {/* **********************Manage Modal********************** */}
      <Modal size="md" show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Manage</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center' }}>
          {userFound === 'User found!' ? (
            <div>
              <div className="row">
                <div className="col-md">
                  <FloatingLabel controlId="floatingInput" label="Procedure:" className="mb-3">
                    <Form.Control type="text" onChange={procedures} placeholder="" />
                  </FloatingLabel>
                </div>
                <div className="col-md">
                  <FloatingLabel controlId="floatingInput" label="Cost:" className="mb-3">
                    <Form.Control type="text" onChange={cost} placeholder="" />
                  </FloatingLabel>
                </div>
              </div>
              <FloatingLabel controlId="floatingInput" label="Note:" className="mb-3">
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    setNotes(e.target.value);
                  }}
                  placeholder=""
                />
              </FloatingLabel>
            </div>
          ) : (
            <span style={{ fontSize: '18px' }}>Patient doesn't exist.</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={Proccessing} disabled={userFound !== 'User found!'}>
            Process Payment
          </Button>
          <Button
            onClick={() => {
              setShowReschedModal(true);
              setShow(false);
            }}
          >
            Reschedule
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* **********************Edit Modal********************** */}
      <Modal
        size="sm"
        show={editModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Edit</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
            <Form.Control type="text" placeholder="" value={name} onChange={editName} />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label="Lastname" className="mb-3">
            <Form.Control type="text" placeholder="" value={lastname} onChange={editLastName} />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={updateNameAndLastname}>
            Update
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* **********************Cancel Modal********************** */}
      <Modal show={showCancel} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Cancel </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingTextarea" label="Reasons for Cancelling" className="mb-3">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: '80px' }}
              onChange={reasonsValue}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelBooking}>
            Confirm
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* **********************Reschedule Modal********************** */}
      <Modal show={showReschedModal} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Reschedule </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Form.Group as={Col} md="6">
              <Form.Label>Day</Form.Label>
              <Form.Select aria-label="Default select example">
                <option value="">Select ---</option>

                {numberOfDays.map((numberOfday) => (
                  <option value="Male">{numberOfday}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Time</Form.Label>
              <Form.Select aria-label="Default select example">
                <option>Select ---</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="12:30">12:30 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="13:30">01:30 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="14:30">02:30 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="15:30">03:30 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="16:30">04:30 PM</option>
                <option value="17:00">05:00 PM</option>
                <option value="17:30">05:30 PM</option>
                <option value="18:00">06:00 PM</option>
              </Form.Select>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={cancelBooking}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

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
