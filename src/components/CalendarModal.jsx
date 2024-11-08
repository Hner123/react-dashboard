import { Button, Modal } from 'react-bootstrap';
import '../style/calendarModal.css';
import axios from 'axios';
import { format, parse } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import CalendarResched from './CalendarResched';
import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { rQuerySetstatus } from '../reactQueryApi/api';
import CalendarCheckout from './CalendarCheckout';

export default function CalendarModal({
  bgColor,
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
  dateStart,
}) {
  const queryClient = useQueryClient();
  const [shoModalReshed, setShowModalResched] = useState(false);
  const [showModalCheckout, setShowModalCheckout] = useState(false);

  const deleteBooking = async ({ id }) => {
    const { data } = await axios.post(process.env.REACT_APP_DELETEBOOKING, { id, nameP, dateStart, timeS });
    return data;
  };

  const mutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries('deleteBooking');
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

  const mutationChangeStatus = useMutation({
    mutationFn: rQuerySetstatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['patientBooking']);
      console.log('success changing status');
      // closeModal();
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

  const handleDeleteBooking = () => {
    mutation.mutate({ id });
  };

  const [changeStats, setChangeStats] = useState(bgColor);

  useEffect(() => {
    setChangeStats(bgColor);
    console.log('YAWA ', dateStart);
  }, [showModal]);

  const handleStatus = (event) => {
    const status = event.target.value;
    setChangeStats(status);
    mutationChangeStatus.mutate({ id, status });
  };

  const patientStatusIcon = (colorStats) => {
    if (colorStats === '#2ED8B6') {
      return (
        <div className="approvedIcon d-flex justify-content-center">
          <CheckCircleOutlineIcon />
        </div>
      );
    } else if (colorStats === '#B0B0B0') {
      return null;
    } else {
      return (
        <div className="pendingIcon d-flex justify-content-center">
          <AccessTimeIcon />
        </div>
      );
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Booking Details</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md colorStatus" style={{ backgroundColor: `${changeStats}` }}></div>
            <div className="patientModalInfo col-md-5">
              <h5>{nameP}</h5>
              <span>{emailP}</span> <br />
              <span>{phoneNum}</span>
            </div>
            <div className="iconStatus">
              {patientStatusIcon(changeStats)}

              {bgColor === '#B0B0B0' ? null : (
                <Form.Select aria-label="Default select example" defaultValue={bgColor} onChange={handleStatus}>
                  <option value="#2ED8B6">Approved</option>
                  <option value="#FFB64D">Pending</option>
                </Form.Select>
              )}
            </div>
          </div>
          <div className="otherPatientInfo">
            <p style={{ width: '320px' }}>
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

          {bgColor === '#B0B0B0' ? null : (
            <>
              <Button
                onClick={() => {
                  setShowModalResched(true);
                  closeModal();
                }}
                variant="outline-secondary"
              >
                Reschedule
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setShowModalCheckout(true);
                  closeModal();
                }}
              >
                Checkout
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <CalendarCheckout
        setShowModalCheckout={setShowModalCheckout}
        showModalCheckout={showModalCheckout}
        nameP={nameP}
        emailP={emailP}
        servicesP={servicesP}
        id={id}
      />
      <CalendarResched shoModalReshed={shoModalReshed} setShowModalResched={setShowModalResched} />
    </>
  );
}
