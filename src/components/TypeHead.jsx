import { useState, useEffect } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import { Typeahead } from 'react-bootstrap-typeahead';
import MaterialUIButton from '@mui/material/Button';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function TypeHead() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [walkInModal, setWalkinModal] = useState(false);
  const [walkInModal2, setWalkinModal2] = useState(false);
  const [procedure, setProcedure] = useState('');
  const [paymentCost, setPaymentCost] = useState('');
  const [notes, setNotes] = useState('');
  const [openS, setOPenS] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('');

  const procedures = (event) => {
    setProcedure(event.target.value);
  };
  const cost = (event) => {
    setPaymentCost(event.target.value);
  };

  const handleClose = () => {
    setWalkinModal(false);
    setWalkinModal2(false);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOPenS(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_TYPEHEAD);
      const names = response.data.Patients.map((patient) => patient.name);
      console.log('Typehead fetch succesfully: ', response.data.Patients);
      setOptions(response.data.Patients);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const Proccessing = async () => {
    try {
      const id = selected[0].id;
      const data = { id, procedure, paymentCost, notes };

      const response = await axios.post(process.env.REACT_APP_WALKINPROCESS, data);
      console.log('processpayment data successfully: ', response.data);

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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <MaterialUIButton
        onClick={() => setWalkinModal(true)}
        size="small"
        variant="contained"
        color="primary"
        startIcon={<DirectionsWalkIcon />}
      >
        Walk-in
      </MaterialUIButton>

      <Modal show={walkInModal} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Walk-in </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Please select patient.</span>

          <Typeahead
            id="autocomplete"
            labelKey="name" // The key in your data object to use as the display value
            // minLength={2} // Minimum characters before triggering a search
            onChange={(selected) => setSelected(selected)}
            options={options}
            placeholder="Type a name..."
            selected={selected}
          />

          {/* <button onClick={() => console.log(selected[0].name)}>HEINER</button> */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setWalkinModal2(true);
              setWalkinModal(false);
            }}
            disabled={selected.length === 0}
          >
            Next
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={walkInModal2}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">{selected.length !== 0 ? selected[0].name : 'Selected none'}</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={Proccessing}>
            Process Payment
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
