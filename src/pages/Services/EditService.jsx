import { useEffect, useState, useContext } from 'react';
import { Button, Modal, Row, Form, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { editService } from '../../reactQueryApi/api';
import MyContext from '../../MyContext';

export default function EditService({ showEditServiceModal, setShowEditServiceModal }) {
  const { editServiceData } = useContext(MyContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const id = editServiceData.id;
    const service = data.service;
    const duration = data.duration;
    console.log({ id, service, duration });
    editMutation.mutate({ id, service, duration });
  };

  const closeModal = () => {
    setShowEditServiceModal(false);
  };

  const queryClient = useQueryClient();
  const editMutation = useMutation({
    mutationFn: editService,
    onSuccess: (data) => {
      console.log(data);
      if (data.message === 'success') {
        queryClient.invalidateQueries({ queryKey: ['CategoryServiceList'] });
        closeModal();
        Swal.fire({
          title: 'Success!',
          text: 'Successfully edited service',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'error!',
          text: data,
          icon: 'error',
        });
      }
    },
    onError: (error) => {
      // Handle error, e.g., display a notification to the user
      console.error('Error retrieving disable time:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add service. Please try again in a few seconds.',
        error,
        icon: 'error',
      });
    },
  });

  // useEffect(() => {
  //   if (editServiceData) {
  //     reset({
  //       service: editServiceData.service_name,
  //       duration: editServiceData.service_duration,
  //     });
  //   }
  // }, [editServiceData, reset]);

  useEffect(() => {
    console.log(editServiceData);
    reset();
  }, [reset, editServiceData]);

  const [durationList] = useState([
    { name: '5 mins', value: '5 mins' },
    { name: '10 mins', value: '10 mins' },
    { name: '15 mins', value: '15 mins' },
    { name: '20 mins', value: '20 mins' },
    { name: '25 mins', value: '25 mins' },
    { name: '30 mins', value: '30 mins' },
    { name: '35 mins', value: '35 mins' },
    { name: '40 mins', value: '40 mins' },
    { name: '45 mins', value: '45 mins' },
    { name: '50 mins', value: '50 mins' },
    { name: '55 mins', value: '55 mins' },
    { name: '1 hr', value: '1 hr' },
    { name: '1 hr 5 mins', value: '1 hr 5 mins' },
    { name: '1 hr 10 mins', value: '1 hr 10 mins' },
    { name: '1 hr 15 mins', value: '1 hr 15 mins' },
    { name: '1 hr 20 mins', value: '1 hr 20 mins' },
    { name: '1 hr 25 mins', value: '1 hr 25 mins' },
    { name: '1 hr 30 mins', value: '1 hr 30 mins' },
    { name: '1 hr 35 mins', value: '1 hr 35 mins' },
    { name: '1 hr 40 mins', value: '1 hr 40 mins' },
    { name: '1 hr 45 mins', value: '1 hr 45 mins' },
    { name: '1 hr 50 mins', value: '1 hr 50 mins' },
    { name: '1 hr 55 mins', value: '1 hr 55 mins' },
    { name: '2 hr', value: '2 hr' },
    { name: '2 hrs 5 mins', value: '2 hrs 5 mins' },
    { name: '2 hrs 10 mins', value: '2 hrs 10 mins' },
    { name: '2 hrs 15 mins', value: '2 hrs 15 mins' },
    { name: '2 hrs 20 mins', value: '2 hrs 20 mins' },
    { name: '2 hrs 25 mins', value: '2 hrs 25 mins' },
    { name: '2 hrs 30 mins', value: '2 hrs 30 mins' },
    { name: '2 hrs 35 mins', value: '2 hrs 35 mins' },
    { name: '2 hrs 40 mins', value: '2 hrs 40 mins' },
    { name: '2 hrs 45 mins', value: '2 hrs 45 mins' },
    { name: '2 hrs 50 mins', value: '2 hrs 50 mins' },
    { name: '2 hrs 55 mins', value: '2 hrs 55 mins' },
    { name: '3 hrs', value: '3 hrs' },
    { name: '3 hrs 5 mins', value: '3 hrs 5 mins' },
    { name: '3 hrs 10 mins', value: '3 hrs 10 mins' },
    { name: '3 hrs 15 mins', value: '3 hrs 15 mins' },
    { name: '3 hrs 20 mins', value: '3 hrs 20 mins' },
    { name: '3 hrs 25 mins', value: '3 hrs 25 mins' },
    { name: '3 hrs 30 mins', value: '3 hrs 30 mins' },
    { name: '3 hrs 35 mins', value: '3 hrs 35 mins' },
    { name: '3 hrs 40 mins', value: '3 hrs 40 mins' },
    { name: '3 hrs 45 mins', value: '3 hrs 45 mins' },
    { name: '3 hrs 50 mins', value: '3 hrs 50 mins' },
    { name: '3 hrs 55 mins', value: '3 hrs 55 mins' },
    { name: '4 hrs', value: '4 hrs' },
    { name: '4 hrs 5 mins', value: '4 hrs 5 mins' },
    { name: '4 hrs 10 mins', value: '4 hrs 10 mins' },
    { name: '4 hrs 15 mins', value: '4 hrs 15 mins' },
    { name: '4 hrs 20 mins', value: '4 hrs 20 mins' },
    { name: '4 hrs 25 mins', value: '4 hrs 25 mins' },
    { name: '4 hrs 30 mins', value: '4 hrs 30 mins' },
    { name: '4 hrs 35 mins', value: '4 hrs 35 mins' },
    { name: '4 hrs 40 mins', value: '4 hrs 40 mins' },
    { name: '4 hrs 45 mins', value: '4 hrs 45 mins' },
    { name: '4 hrs 50 mins', value: '4 hrs 50 mins' },
    { name: '4 hrs 55 mins', value: '4 hrs 55 mins' },
    { name: '5 hrs', value: '5 hrs' },
  ]);

  return (
    <>
      <Modal show={showEditServiceModal} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">
              Edit Service <span style={{ fontSize: '16px', color: '#9E9E9E' }}></span>
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="EditServiceForm" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Edit Name</Form.Label>
                <Form.Control
                  defaultValue={editServiceData.service_name}
                  {...register('service', { required: 'Select' })}
                  isInvalid={!!errors.service}
                  size="sm"
                  type="text"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Duration</Form.Label>
                <Form.Select
                  defaultValue={editServiceData.service_duration}
                  {...register('duration', { required: 'asd' })}
                  isInvalid={!!errors.duration}
                  size="sm"
                >
                  {durationList?.map((duration, index) => (
                    <option key={index} value={duration.value}>
                      {duration.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="outline-primary" form="EditServiceForm">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
