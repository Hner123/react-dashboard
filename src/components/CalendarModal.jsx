import { Button, Modal } from 'react-bootstrap';
import '../style/calendarModal.css';
import axios from 'axios';
import { format, parse } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

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
  const queryClient = useQueryClient();

  const deleteBooking = async ({ id }) => {
    const { data } = await axios.post(process.env.REACT_APP_DELETEBOOKING, { id });
    return data;
  };

  const mutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries('patientBooking');
      closeModal();
    },
    onError: (error) => {
      // Handle error, e.g., display a notification to the user
      console.error('Error deleting booking:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to cancel booking. Please try again.',
        icon: 'error',
      });
    },
  });

  const handleDeleteBooking = () => {
    mutation.mutate({ id });
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
              Time:{' '}
              <span>
                {format(parse(timeS, 'HH:mm', new Date()), 'hh:mm a')} - {endTime} ( {durationP} )
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
          <Button
            onClick={() =>
              Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                reverseButtons: true, // Add this line to swap the buttons
                cancelButtonColor: '#C8C8C8',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
              }).then((result) => {
                if (result.isConfirmed) {
                  handleDeleteBooking();
                  Swal.fire({
                    title: 'Canceled!',
                    text: 'Canceled booking successfully.',
                    icon: 'success',
                  });
                }
              })
            }
            variant="danger"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Cancelling...' : 'Cancel Appointment'}
          </Button>
          <Button variant="outline-secondary">Reschedule</Button>
          <Button variant="outline-primary">Checkout</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
