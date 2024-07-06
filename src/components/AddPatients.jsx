import { Button, Modal, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Spinner from 'react-bootstrap/Spinner';

export default function AddPatients({ patientModalOpen, patientModalClose, refetchData }) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [number, setNumber] = useState('');
  const [birth, setBirth] = useState('');
  const [validated, setValidated] = useState(false);
  const [modalClose, setModalClose] = useState(patientModalClose);
  const [openS, setOPenS] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState('');
  const [snackMessage, setSnackMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setModalClose(patientModalClose());
    setValidated(false);
  };

  const fetchData = () => refetchData();

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOPenS(false);
  };

  const saveData = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    console.log('name ito :' + name);
    console.log('lastName ito :' + lastName);
    console.log('address ito :' + address);
    console.log('email ito :' + email);
    console.log('gender ito :' + gender);
    console.log('number ito :' + number);
    console.log('birth ito :' + birth);
    if (name != '' && lastName != '' && address != '' && email != '' && gender != '' && number != '' && birth != '') {
      try {
        setIsLoading(true);
        const data = { name, lastName, address, email, gender, number, birth };
        const response = await axios.post(process.env.REACT_APP_ADDPATIENT, data);
        console.log('succesfully saved patient :' + response.data);
        closeModal();

        setName('');
        setLastName('');
        setAddress('');
        setEmail('');
        setGender('');
        setNumber('');
        setBirth('');

        setOPenS(true);
        setSnackMessage('Succesfully added patient!');
        setSnackSeverity('success');

        fetchData();
      } catch (error) {
        console.log('Error saving patient :', error);
        setOPenS(true);
        setSnackMessage('Error adding patient!');
        setSnackSeverity('error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Modal size="lg" show={patientModalOpen} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Add a patient </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="addPatientForm" noValidate validated={validated} onSubmit={saveData}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom01">
                <Form.Label>First name</Form.Label>
                <Form.Control required type="text" placeholder="First name" onChange={(event) => setName(event.target.value)} />
                <Form.Control.Feedback type="invalid">Please enter a name.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom02">
                <Form.Label>Last name</Form.Label>
                <Form.Control required type="text" placeholder="Last name" onChange={(event) => setLastName(event.target.value)} />
                <Form.Control.Feedback type="invalid">Please enter a last name.</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="validationCustom03">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Address" required onChange={(event) => setAddress(event.target.value)} />
                <Form.Control.Feedback type="invalid">Please provide a valid address.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom04">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" required onChange={(event) => setEmail(event.target.value)} />
                <Form.Control.Feedback type="invalid">Please provide an email.</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="3" controlId="validationCustom05">
                <Form.Label>Gender</Form.Label>
                <Form.Select aria-label="Default select example" onChange={(event) => setGender(event.target.value)} required>
                  <option value="">Select ---</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">Please select a gender.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom06">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="number" placeholder="Phone number" required onChange={(event) => setNumber(event.target.value)} />
                <Form.Control.Feedback type="invalid">Please provide a phone number.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom07">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" placeholder="" required onChange={(event) => setBirth(event.target.value)} />
                <Form.Control.Feedback type="invalid">Please select your birth date.</Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" form="addPatientForm" variant="primary" disabled={isLoading} onClick={saveData}>
            <Spinner style={{ display: isLoading ? 'inline-block' : 'none' }} animation="border" size="sm" /> &nbsp;
            {isLoading ? 'Adding...' : 'Add Patient'}
          </Button>

          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Snackbar open={openS} autoHideDuration={2000} onClose={handleCloseSnack} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnack} severity={snackSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
