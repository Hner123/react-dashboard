import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useContext, useState } from 'react';
import MyContext from '../MyContext';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPatientBooking, fetchServiceList, fetchTimeList, sendReschedForm, resEditPatientDetails } from '../reactQueryApi/api';
import Swal from 'sweetalert2';
import { parse, format, subMinutes, addMinutes } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';

export default function CalendarResched({ shoModalReshed, setShowModalResched }) {
  const [patientDetails, setPatientDetals] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [receiveTimeList, setReceiveTimeList] = useState('');

  const [editForm, setEditForm] = useState('MainForm');

  const { branchLoc, setBranchLoc, id, setId, branchList } = useContext(MyContext);

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

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const {
    data: patientData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['patientBooking'],
    queryFn: fetchPatientBooking,
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

  const mutationResched = useMutation({
    mutationFn: sendReschedForm,
    onSuccess: (data) => {
      queryClient.invalidateQueries('sendReschedForm');
      console.log('Success resched Form... :', data);
      handleCloseModal();
      Swal.fire({
        title: 'Success!',
        text: 'Successfully Reschedule.',
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

  const mutationEditDetails = useMutation({
    mutationFn: resEditPatientDetails,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patientBooking'] });
      if (data === 'success') {
        Swal.fire({
          title: 'Success!',
          text: 'Edit details success',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: JSON.stringify(data),
          icon: 'error',
        });
      }
    },
    onError: (error) => {
      // Handle error, e.g., display a notification to the user
      console.error('Error send form:', error);
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
      });
    },
  });

  const handleFetchTime = (dateSelected) => {
    mutation.mutate({ dateSelected, selectedBranch });
  };

  const handleCloseModal = () => {
    setShowModalResched(false);
    reset();
    setReceiveTimeList('');
    setEditForm('MainForm');
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

  useEffect(() => {
    const filteredList = patientData?.find((booking) => booking[branchLoc]);
    if (filteredList) {
      const datas = filteredList[branchLoc];
      const result = datas.find((data) => data.id == id);
      setPatientDetals(result);
    }
  }, [branchLoc, patientData, id]);

  const onSubmit = (data) => {
    mutationResched.mutate({
      id,
      selectedBranch,
      service: data.service,
      date: data.date,
      time: data.time,
      serviceDuration,
      title: patientDetails.title,
    });
  };

  const onSubmitEditForm = (data) => {
    // console.log('daya ', { id, name: data.name, lastname: data.lastname, email: data.email, phoneNumber: data.phoneNumber });
    mutationEditDetails.mutate({ id, name: data.name, lastname: data.lastname, email: data.email, phoneNumber: data.phoneNumber });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <Modal show={shoModalReshed} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">{editForm === 'MainForm' ? 'Reschedule' : 'Edit'}</p>

            <CalendarResched />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* ************ BODY******************* */}

          {editForm === 'MainForm' ? (
            <>
              <div className="row">
                <div className="col">
                  <h5 className="m-0">
                    {patientDetails?.title}
                    <span className="ms-3">
                      <EditIcon
                        color="primary"
                        fontSize="small"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setEditForm('EditPatient');
                        }}
                      />
                    </span>
                  </h5>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#939393' }}>{patientDetails?.email}</span> <br />
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#939393' }}>{patientDetails?.phoneNum}</span>
                </div>
              </div>

              <Form id="RescheduleForm" noValidate onSubmit={handleSubmit(onSubmit)}>
                {/* **************************************************SELECT BRANCH FORM*************************************** */}
                <Row className="mt-3">
                  <Form.Group as={Col} controlId="selectBranchValidation">
                    <Form.Label>Location</Form.Label>
                    <Form.Select onChange={(event) => setSelectedBranch(event.target.value)} value={selectedBranch} required>
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
                    <Form.Select {...register('time', { required: 'Select a time.' })} isInvalid={!!errors.time}>
                      {receiveTimeList !== '' ? (
                        timeList?.map((time, index) => {
                          const inRange = receiveTimeList?.some(
                            (receiveTime) =>
                              receiveTime.id != id &&
                              ((receiveTime.start <= time.useTime && addDuration(receiveTime.start, receiveTime.duration) >= time.useTime) ||
                                (subtractTime(receiveTime.start, serviceDuration) < time.useTime && receiveTime.start > time.useTime))
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
              </Form>
            </>
          ) : (
            <Form id="EditRescheduleForm" noValidate onSubmit={handleSubmit(onSubmitEditForm)}>
              <Row>
                <Form.Group as={Col} className="mt-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control {...register('name')} size="sm" type="text" defaultValue={patientDetails?.name} />
                </Form.Group>
                <Form.Group as={Col} className="mt-2">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control {...register('lastname')} size="sm" type="text" defaultValue={patientDetails?.lastName} />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group as={Col} className="mt-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control {...register('email')} size="sm" type="email" defaultValue={patientDetails?.email} />
                </Form.Group>
                <Form.Group as={Col} className="mt-2">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control {...register('phoneNumber')} size="sm" type="number" defaultValue={patientDetails?.phoneNum} />
                </Form.Group>
              </Row>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          {editForm === 'MainForm' ? (
            <>
              <Button onClick={handleCloseModal} variant="outline-secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary" form="RescheduleForm">
                Update
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setEditForm('MainForm');
                  reset();
                }}
                variant="outline-secondary"
              >
                Back
              </Button>
              <Button type="submit" variant="primary" form="EditRescheduleForm">
                Save
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
