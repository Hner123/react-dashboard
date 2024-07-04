import { useState } from 'react';
import { Button, Modal, Row, Form, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { addCategoryfunction } from '../../reactQueryApi/api';

export default function AddCategory({ showAddCategory, handleCloseModal }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const closeModal = () => {
    handleCloseModal();
    reset();
  };

  const onSubmit = (data) => {
    console.log(data);
    const category = data.category;
    addCategoryMutation.mutate({ category });
  };

  const queryClient = useQueryClient();
  const addCategoryMutation = useMutation({
    mutationFn: addCategoryfunction,
    onSuccess: (data) => {
      if (data.message === 'success') {
        closeModal();
        queryClient.invalidateQueries({ queryKey: ['CategoryServiceList'] });
        Swal.fire({
          title: 'Success!',
          text: 'Successfully added category',
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
    onError: (error) => ({
      title: 'Error',
      text: 'error from client side, please contact admin - ' + error,
      icon: 'error',
    }),
  });

  return (
    <>
      <Modal show={showAddCategory} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Add Category</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="AddCategory" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Category Name</Form.Label>
                <Form.Control {...register('category', { required: 'Select' })} isInvalid={!!errors.category} size="sm" type="text" />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" form="AddCategory">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
