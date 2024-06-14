import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import '../style/calendarModal.css';
import { useEffect } from 'react';
import axios from 'axios';

export default function CalendarModal({
  showModal,
  closeModal,
  nameP,
  emailP,
  servicesP,
  notesP,
  statusP,
  timeS,
  durationP,
  phoneNum,
  endTime,
  id,
}) {
  const deletePatientBooking = async () => {
    try {
      const data = { id };
      const response = await axios.post(process.env.REACT_APP_DELETEBOOKING, data);
      console.log(response.data);
    } catch (error) {
      console.log('Failed to delete patient booking: ', error);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Booking Details </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="patientModalInfo">
            <h5>{nameP}</h5>
            <span>{emailP}</span> <br />
            <span>{phoneNum}</span>
          </div>

          <div className="otherPatientInfo">
            <p>
              Service: <span>{servicesP}</span>
            </p>
            <p>
              Time:
              <span>
                {timeS} - {endTime} ( {durationP} )
              </span>
            </p>
            <p>
              Patient Status: <span>{statusP}</span>
            </p>
            <p>
              Booking Notes: <span>{notesP}</span>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => deletePatientBooking()} variant="danger">
            Cancel Appointment
          </Button>
          <Button variant="outline-secondary">Reschedule</Button>
          <Button variant="outline-primary">Checkout</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
