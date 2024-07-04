import { Button, Modal, Row, Form, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { addNewLocation } from '../../reactQueryApi/api';

export default function AddNewCategory({ showAddNewModal, closeModal }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const branch = data.branchName;
    const location = data.location;
    addNew.mutate({ branch, location });
  };

  const queryClient = useQueryClient();
  const addNew = useMutation({
    mutationFn: addNewLocation,
    onSuccess: (data) => {
      if (data.message === 'success') {
        queryClient.invalidateQueries({ queryKey: ['fetchBranch'] });
        closeModal();
        reset();
        Swal.fire({
          title: 'Success!',
          text: 'Successfully added branch',
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
      console.error('Error adding location:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add new branch. ' + error,
        icon: 'error',
      });
    },
  });

  return (
    <>
      <Modal show={showAddNewModal} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Add Location </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="addLocation" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Branch Name</Form.Label>
                <Form.Control {...register('branchName', { required: '...' })} isInvalid={!!errors.service} size="sm" type="text" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Location</Form.Label>
                <Form.Control {...register('location', { required: '...' })} isInvalid={!!errors.service} size="sm" type="text" />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" form="addLocation">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
