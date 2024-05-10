import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

export default function BlockDateModal({ setBlockDateUpdate }) {
  const [validated, setValidated] = useState(false);
  const [showMods, setShowMods] = useState(false);

  const [selectedDate, setSelectedDate] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  const [remarks, setRemarks] = useState('');

  const closeModal = () => {
    setShowMods(false);
    setValidated(false);
  };

  const blockDate = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    console.log(selectedDate + '-' + branchLocation + '-' + remarks);

    if (selectedDate === '' || branchLocation === '' || remarks === '') {
      console.log('need to fill out this fields...');
    } else {
      try {
        const data = { selectedDate, branchLocation, remarks };
        const response = await axios.post(process.env.REACT_APP_BLOCKDATE, data);
        console.log('success blocking... ', response.data);
        if (response.data === 'success') {
          setBlockDateUpdate(response);
          closeModal();
        }
      } catch (error) {
        console.log('error blocking a date... ', error);
      }
    }
  };

  return (
    <>
      <Button onClick={() => setShowMods(true)}>Block Date</Button>

      <Modal show={showMods} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Block a date </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="blockDateID" noValidate validated={validated} onSubmit={blockDate}>
            <Row>
              <Form.Group as={Col} controlId="validationCustom02" className="d-flex align-items-end">
                <div>
                  <Form.Label>Select Date:</Form.Label>
                  <br />
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MM/dd/yyyy"
                    isClearable
                    placeholderText="mm/dd/yyyy"
                    className="datePick form-control"
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="validationCustom01">
                <Form.Label className="mt-3">Remarks</Form.Label>
                <Form.Control
                  required
                  //   ref={currentPass}
                  onChange={(event) => setRemarks(event.target.value)}
                  type="text"
                  placeholder="Remarks"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom06">
                <Form.Label className="mt-3">Branch</Form.Label>
                <Form.Select
                  onChange={(event) => setBranchLocation(event.target.value)}
                  aria-label="Default select example"
                  required
                >
                  <option value="">Select ---</option>
                  <option value="Marikina">Marikina</option>
                  <option value="Antipolo">Antipolo</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" form="blockDateID">
            Block Date
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
