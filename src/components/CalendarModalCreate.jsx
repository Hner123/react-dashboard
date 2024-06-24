import { Typeahead } from 'react-bootstrap-typeahead';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parse, format, subMinutes, addMinutes } from 'date-fns';
import Swal from 'sweetalert2';
import { fetchPatientList, fetchBranchList, fetchServiceList, fetchTimeList, sendNewBookingForm } from '../reactQueryApi/api.js';
import { useContext } from 'react';
import MyContext from '../MyContext.jsx';

export default function CalendarModalCreate({ showModalCreate, closeModal }) {
  const [selected, setSelected] = useState(['']);
  const [receiveTimeList, setReceiveTimeList] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const { branchList } = useContext(MyContext);

  //   *********************REACT FORM LINE HERE*****************************
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  //   *********************REACT QUERY*****************************
  const {
    data: patientList,
    error: patientError,
    isLoading: patientLoading,
  } = useQuery({
    queryKey: ['patientTypeHead'],
    queryFn: fetchPatientList,
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
      console.error('Error retrieving disable time:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to view time disable. Please try again.',
        icon: 'error',
      });
    },
  });

  const handleFetchTime = (dateSelected) => {
    mutation.mutate({ dateSelected, selectedBranch });
  };

  const mutation2 = useMutation({
    mutationFn: sendNewBookingForm,
    onSuccess: (data) => {
      queryClient.invalidateQueries('sendNewBookingForm');
      console.log('Success send Form... :', data);
      handleCloseModal();
      setLoading(false);
      Swal.fire({
        title: 'Success!',
        text: 'Successfully added.',
        icon: 'success',
      });
    },
    onError: (error) => {
      // Handle error, e.g., display a notification to the user
      console.error('Error send form:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to sending form. Please try again.',
        icon: 'error',
      });
    },
  });

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
    { useTime: '', displayTime: 'Select time-' },
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

  if (serviceListError) {
    return <div>Error: {serviceListError.message}</div>;
  }
  // addDuration;
  // subtractTime;
  const subtractTime = (time, duration) => {
    const parsedTime = parse(time, 'HH:mm', new Date());

    // Split the duration into parts
    const durationParts = duration.split(' ');
    let totalMinutes = 0;

    // Iterate over the parts and add the corresponding minutes
    for (let i = 0; i < durationParts.length; i += 2) {
      const amount = parseInt(durationParts[i]);
      const unit = durationParts[i + 1];

      if (unit.includes('hr')) {
        totalMinutes += amount * 60 - 1;
      } else if (unit.includes('min')) {
        totalMinutes += amount - 1;
      }
    }
    console.log(totalMinutes);
    // Add the total minutes to the parsed time
    const updatedTime = subMinutes(parsedTime, totalMinutes);

    return format(updatedTime, 'HH:mm');
  };

  const addDuration = (time, duration) => {
    const parsedTime = parse(time, 'HH:mm', new Date());

    // Split the duration into parts
    const durationParts = duration.split(' ');
    let totalMinutes = 0;

    // Iterate over the parts and add the corresponding minutes
    for (let i = 0; i < durationParts.length; i += 2) {
      const amount = parseInt(durationParts[i]);
      const unit = durationParts[i + 1];

      if (unit.includes('hr')) {
        totalMinutes += amount * 60 - 1;
      } else if (unit.includes('min')) {
        totalMinutes += amount - 1;
      }
    }
    console.log(totalMinutes);
    // Add the total minutes to the parsed time
    const updatedTime = addMinutes(parsedTime, totalMinutes);

    return format(updatedTime, 'HH:mm');
  };

  const onSubmit = (data) => {
    setLoading(true);
    const firstName = selected[0].first_name;
    const lastName = selected[0].last_name;
    const emailAdd = selected[0].email_address;
    const phoneNum = selected[0].phone_number;
    mutation2.mutate({
      firstName,
      lastName,
      emailAdd,
      phoneNum,
      selectedBranch,
      service: data.service,
      serviceDuration,
      date: data.date,
      time: data.time,
      notes: data.notes,
    });
  };

  const handleCloseModal = () => {
    closeModal();
    reset();
    setSelected([]);
    setReceiveTimeList('');
  };

  return (
    <>
      <Modal show={showModalCreate} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0"> Add Appointment </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="NewAppointmentForm" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <span className="mb-2">Please select patient.</span>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: 'Select a patient.' }}
                render={({ field }) => (
                  <Typeahead
                    {...field}
                    id="autocomplete"
                    labelKey="name"
                    minLength={1}
                    onChange={(selected) => {
                      setSelected(selected);
                      field.onChange(selected);
                    }}
                    options={patientList}
                    placeholder="Type a name..."
                    selected={field.value || selected}
                    isInvalid={!!errors.fullName}
                  />
                )}
              />
              {errors.fullName && <div className="invalid-feedback d-block">{errors.fullName.message}</div>}
            </Row>
            {/* **************************************************SELECT BRANCH FORM*************************************** */}
            <Row className="mt-3">
              <Form.Group as={Col} controlId="selectBranchValidation">
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
              {/* **************************************************SELECT SERVICE FORM*************************************** */}
              <Form.Group as={Col} controlId="serviceValidation">
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
                      {list.service_name} - {list.service_duration}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            {/* **************************************************SELECT DATE FORM*************************************** */}
            <Row className="mt-3">
              <Form.Group as={Col} controlId="selectAdateValidation">
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
              </Form.Group>
              {/* **************************************************SELECT TIME FORM*************************************** */}
              <Form.Group as={Col} controlId="selectTimeValidation">
                <Form.Label>Time</Form.Label>
                <Form.Select {...register('time', { required: 'Select a time.' })} isInvalid={!!errors.time} aria-label="Default select example">
                  {receiveTimeList !== '' ? (
                    timeList?.map((time, index) => {
                      const inRange = receiveTimeList?.some(
                        (receiveTime) =>
                          (receiveTime.start <= time.useTime && addDuration(receiveTime.start, receiveTime.duration) >= time.useTime) ||
                          (subtractTime(receiveTime.start, serviceDuration) < time.useTime && receiveTime.start > time.useTime)
                      );
                      return inRange ? null : (
                        <option key={index} value={time.useTime}>
                          {time.displayTime}
                        </option>
                      );
                    })
                  ) : (
                    <option value="">Select a date first</option>
                  )}
                </Form.Select>
              </Form.Group>
            </Row>
            {/* **************************************************NOTES FORM*************************************** */}
            <Row>
              <Form.Group className="mt-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>
                  Appointment Notes <span style={{ fontSize: '13px' }}>(optional)</span>
                </Form.Label>
                <Form.Control {...register('notes')} as="textarea" rows={2} />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} variant="outline-secondary">
            Cancel
          </Button>
          <Button type="submit" form="NewAppointmentForm" disabled={loading}>
            {loading ? 'Adding...' : 'Add Patient'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
