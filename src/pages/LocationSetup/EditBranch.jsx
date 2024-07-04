import { data } from 'jquery';
import { useEffect, useState } from 'react';
import { Button, Modal, Row, Form, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function EditBranch({ showEditModal, closeModal, editData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleCloseModal = () => {
    closeModal();
  };

  const editBranchLocation = async ({ id, branchName, location }) => {
    const response = await axios.post(process.env.REACT_APP_EDITBRANCH, { id, branchName, location });
    return response.data;
  };

  const queryClient = useQueryClient();
  const editLocation = useMutation({
    mutationFn: editBranchLocation,
    onSuccess: (data) => {
      handleCloseModal();
      if (data.message === 'success') {
        queryClient.invalidateQueries({ queryKey: ['fetchBranch'] });
        Swal.fire({
          title: 'Success!',
          text: 'Successfully edited',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'error!',
          text: 'Error ' + data,
          icon: 'error',
        });
      }
    },
    onError: (error) => {
      // Handle error, e.g., display a notification to the user
      console.error('Error editing branch:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to edit branch. ' + error,
        icon: 'error',
      });
    },
  });

  const onSubmit = (data) => {
    const id = editData.id;
    const branchName = data.EditBranchName;
    const location = data.EditLocation;
    console.log({ id, branchName, location });
    editLocation.mutate({ id, branchName, location });
  };

  useEffect(() => {
    reset();
  }, [showEditModal]);

  return (
    <>
      <Modal show={showEditModal} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Edit Branch </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="addLocation" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Edit Branch Name</Form.Label>
                <Form.Control
                  defaultValue={editData.branchName}
                  {...register('EditBranchName', { required: '...' })}
                  isInvalid={!!errors.EditBranchName}
                  size="sm"
                  type="text"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Edit Location</Form.Label>
                <Form.Control
                  defaultValue={editData.location}
                  {...register('EditLocation', { required: '...' })}
                  isInvalid={!!errors.EditLocation}
                  size="sm"
                  type="text"
                />
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
