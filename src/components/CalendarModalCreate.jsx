import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parse, format, subMinutes, addMinutes } from 'date-fns';
import Swal from 'sweetalert2';

export default function CalendarModalCreate({ showModalCreate, closeModal }) {
  const [selected, setSelected] = useState(['']);
  const [receiveTimeList, setReceiveTimeList] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');

  //   *********************REACT FORM LINE HERE*****************************
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  //   *********************DATA FETCHING LINE HERE*****************************
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

  //   *********************REACT QUERY*****************************
  const {
    data: patientList,
    error: patientError,
    isLoading: patientLoading,
  } = useQuery({
    queryKey: ['patientTypeHead'],
    queryFn: fetchPatientList,
  });

  const {
    data: branchList,
    error: branchError,
    isLoading: branchLoading,
  } = useQuery({
    queryKey: ['fetchBranch'],
    queryFn: fetchBranchList,
  });

  const { data: serviceList, error: serviceListError } = useQuery({
    queryKey: ['fetchServiceList'],
    queryFn: fetchServiceList,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: fetchTimeList,
    onSuccess: (data) => {
      queryClient.invalidateQueries('disableTime');

      setReceiveTimeList(data);
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

  const handleFetchTime = (dateSelected) => {
    mutation.mutate({ dateSelected, selectedBranch });
  };

  useEffect(() => {
    if (branchList && branchList.length > 0) {
      setSelectedBranch(branchList[0].branchName);
    }
    if (serviceList && serviceList.length > 0) {
      setSelectedService(serviceList[0].service_name);
      setServiceDuration(serviceList[0].service_duration);
    }
  }, [branchList, serviceList]);

  //   *********************TIME LIST*****************************
  const [timeList] = useState([
    { useTime: '10:00', displayTime: '10:00 am' },
    { useTime: '10:15', displayTime: '10:15 am' },
    { useTime: '10:30', displayTime: '10:30 am' },
    { useTime: '10:45', displayTime: '10:45 am' },
    { useTime: '11:00', displayTime: '11:00 am' },
    { useTime: '11:15', displayTime: '11:15 am' },
    { useTime: '11:30', displayTime: '11:30 am' },
    { useTime: '11:45', displayTime: '11:45 am' },
    { useTime: '12:00', displayTime: '12:00 pm' },
    { useTime: '12:15', displayTime: '12:15 pm' },
    { useTime: '12:30', displayTime: '12:30 pm' },
    { useTime: '12:45', displayTime: '12:45 pm' },
    { useTime: '13:00', displayTime: '01:00 pm' },
    { useTime: '13:15', displayTime: '01:15 pm' },
    { useTime: '13:30', displayTime: '01:30 pm' },
    { useTime: '13:45', displayTime: '01:45 pm' },
    { useTime: '14:00', displayTime: '02:00 pm' },
    { useTime: '14:15', displayTime: '02:15 pm' },
    { useTime: '14:30', displayTime: '02:30 pm' },
    { useTime: '14:45', displayTime: '02:45 pm' },
    { useTime: '15:00', displayTime: '03:00 pm' },
    { useTime: '15:15', displayTime: '03:15 pm' },
    { useTime: '15:30', displayTime: '03:30 pm' },
    { useTime: '15:45', displayTime: '03:45 pm' },
    { useTime: '16:00', displayTime: '04:00 pm' },
    { useTime: '16:15', displayTime: '04:15 pm' },
    { useTime: '16:30', displayTime: '04:30 pm' },
    { useTime: '16:45', displayTime: '04:45 pm' },
    { useTime: '17:00', displayTime: '05:00 pm' },
  ]);

  //   *********************ERROR HANDLING*****************************
  if (patientError) {
    return <div>Error: {patientError.message}</div>;
  }

  if (branchError) {
    return <div>Error: {branchError.message}</div>;
  }

  if (serviceListError) {
    return <div>Error: {serviceListError.message}</div>;
  }

  const onSubmit = (data) => {
    // const firstName = selected[0].first_name;
    // const lastName = selected[0].last_name;
    console.log({ service: data.service, date: data.date });
  };

  const subtractTime = (time, duration) => {
    const parsedTime = parse(time, 'HH:mm', new Date());
    const [amount, unit] = duration.split(' ');

    let updatedTime;
    if (unit.includes('hr')) {
      updatedTime = subMinutes(parsedTime, parseInt(amount * 60 - 1));
    } else if (unit.includes('min')) {
      updatedTime = subMinutes(parsedTime, parseInt(amount - 1));
    }

    return format(updatedTime, 'HH:mm');
  };

  const addDuration = (time, duration) => {
    // Parse the time string into a Date object
    const parsedTime = parse(time, 'HH:mm', new Date());
    const [amount, unit] = duration.split(' ');

    let updatedTime;
    if (unit.includes('hr')) {
      updatedTime = addMinutes(parsedTime, parseInt(amount * 60 - 1));
    } else if (unit.includes('min')) {
      updatedTime = addMinutes(parsedTime, parseInt(amount - 1));
    }

    // Format the updated time back to the desired format
    return format(updatedTime, 'HH:mm');
  };

  return (
    <>
      <Modal show={showModalCreate} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0"> Add Appointment </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span className="mb-2">Please select patient.</span>

          <Form.Group as={Col} controlId="validationCustom05">
            <Typeahead
              {...register('fullName', { required: 'select a patient.' })}
              isInvalid={!!errors.fullName}
              id="autocomplete"
              labelKey="name" // The key in your data object to use as the display value
              minLength={2} // Minimum characters before triggering a search
              onChange={(selected) => setSelected(selected)}
              options={patientList}
              placeholder="Type a name..."
              selected={selected}
            />
            <Form.Control.Feedback type="invalid">Please select a patient</Form.Control.Feedback>
          </Form.Group>

          <Form id="NewAppointmentForm" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row className="mt-3">
              <Form.Group as={Col} controlId="validationCustom05">
                <Form.Label>Location</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(event) => setSelectedBranch(event.target.value)}
                  value={selectedBranch}
                  required
                >
                  {branchList?.map((branch, index) => (
                    <option key={index} value={branch.branchName}>
                      {branch.branchName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">Please select a location.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom05">
                <Form.Label>Service</Form.Label>
                <Form.Select
                  {...register('service', { required: 'Select a service.' })}
                  isInvalid={!!errors.service}
                  aria-label="Default select example"
                  onChange={(event) => {
                    const selectedIndex = event.target.selectedIndex;
                    setSelectedService(event.target.value);
                    setServiceDuration(event.target.options[selectedIndex].getAttribute('data-duration'));
                  }}
                  value={selectedService}
                  required
                >
                  {serviceList?.map((list, index) => (
                    <option key={index} value={list.service_name} data-duration={list.service_duration}>
                      {list.service_name} -{' '}
                      <div>
                        <span style={{ fontSize: '8px', color: 'red' }}>{list.service_duration}</span>
                      </div>
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">Please select a service.</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mt-3">
              <Form.Group as={Col} controlId="validationCustom07">
                <Form.Label>Select a date</Form.Label>
                <Form.Control
                  {...register('date', { required: 'Select a date.' })}
                  type="date"
                  placeholder=""
                  isInvalid={!!errors.date}
                  onChange={(event) => {
                    handleFetchTime(event.target.value);
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.date?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom05">
                <Form.Label>Time</Form.Label>
                <Form.Select
                  {...register('time', { required: 'Select a service.' })}
                  isInvalid={!!errors.time}
                  aria-label="Default select example"
                  //   onChange={(event) => setGender(event.target.value)}
                >
                  {receiveTimeList !== '' ? (
                    timeList?.map((time, index) => {
                      const inRange = receiveTimeList?.some(
                        (receiveTime) =>
                          (receiveTime.start <= time.useTime && addDuration(receiveTime.start, receiveTime.duration) >= time.useTime) ||
                          (subtractTime(receiveTime.start, serviceDuration) < time.useTime && receiveTime.start > time.useTime)
                      );
                      return inRange ? (
                        ''
                      ) : (
                        <option key={index} value={time.useTime}>
                          {time.displayTime}
                        </option>
                      );
                    })
                  ) : (
                    <option value="">Select a date first</option>
                  )}
                </Form.Select>
                <Form.Control.Feedback type="invalid">Please select a time.</Form.Control.Feedback>
              </Form.Group>
            </Row>

            {/* <Row>
              <Form.Group as={Col} controlId="validationCustom01">
                <Form.Label className="mt-3">First Name</Form.Label>
                <Form.Control
                  {...register('firstName', { required: 'Please enter a name.' })}
                  type="text"
                  placeholder="Enter first name"
                  size="sm"
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationCustom02">
                <Form.Label className="mt-3">Last Name</Form.Label>
                <Form.Control
                  {...register('lastName', { required: 'Enter a last name.' })}
                  type="text"
                  placeholder="Enter last name"
                  size="sm"
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
              </Form.Group>
            </Row> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => console.log(branchList, ' and ' + selectedBranch + ' and ' + selectedService + ' ' + serviceDuration)}>test</Button>
          <Button onClick={closeModal} variant="outline-secondary">
            Cancel
          </Button>
          <Button type="submit" form="NewAppointmentForm">
            Add Patient
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
