import { Button, Modal } from 'react-bootstrap';
import '../style/calendarCheckout.css';
import Form from 'react-bootstrap/Form';
import { useState, useContext } from 'react';
import MyContext from '../MyContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processPayment } from '../reactQueryApi/api';
import Swal from 'sweetalert2';

export default function CalendarCheckout({ setShowModalCheckout, showModalCheckout, nameP, emailP, servicesP, id }) {
  const [price, setPrice] = useState(0);
  const [assisted, setAssisted] = useState('');
  const [notes, setNotes] = useState('');

  const { name, lastName } = useContext(MyContext);

  const handleCloseModal = () => {
    setShowModalCheckout(false);
  };

  const handleSubmit = () => {
    mutation.mutate({ name, lastName, servicesP, price, assisted, notes, id });
    console.log(name, lastName, servicesP, price, assisted, notes, id);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: processPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patientBooking'] });
      if (data.message === 'Existed') {
        handleCloseModal();
        Swal.fire({
          title: 'Success!',
          text: 'Processed Payment Success.',
          icon: 'success',
        });
      } else if (data.message === 'Did not exist') {
        Swal.fire({
          title: "Patient doesn't exist!",
          text: 'Please add patient first before proceeding.',
          icon: 'info',
        });
      } else {
        Swal.fire({
          title: 'ERROR !',
          text: JSON.stringify(data),
          icon: 'error',
        });
      }
    },
    onError: (error) => {
      console.error('Error changing status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error changing status.',
        icon: 'error',
      });
    },
  });

  return (
    <>
      <Modal className="calendarCheckout" show={showModalCheckout} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Checkout</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="patientModalInfo col-md-5">
            <h5 style={{ fontWeight: '600' }}>{nameP}</h5>
            <span>{emailP}</span> <br />
          </div>
          <table className="table mt-3">
            <thead>
              <tr className="tableRow">
                <th scope="col-4">Service</th>
                <th scope="col-4">Price</th>
                <th scope="col-4">Assisted by</th>
                <th scope="col-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="tableR owData">
                <td style={{ width: '180px' }}>{servicesP}</td>
                <td>
                  <Form.Control type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                </td>
                <td>
                  <Form.Control type="text" id="assistedBy" value={assisted} onChange={(e) => setAssisted(e.target.value)} />
                </td>
                <td>
                  <Form.Control type="text" id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary">Cancel</Button>
          <Button
            onClick={() => {
              handleSubmit();
            }}
            variant="primary"
          >
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
