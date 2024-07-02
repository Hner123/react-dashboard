import { useState, useEffect } from 'react';
import { Button, Modal, Row, Form, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { editCategoryName } from '../../reactQueryApi/api';

export default function EditCategoryName({ showEditCategoryModal, handleCloseModal, categoryName }) {
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
    const categoryN = data.categoryName;
    const categoryID = categoryName.id;
    editCategoryMutation.mutate({ categoryID, categoryN });
    console.log(data);
  };

  const queryClient = useQueryClient();
  const editCategoryMutation = useMutation({
    mutationFn: editCategoryName,
    onSuccess: (data) => {
      if (data.message === 'success') {
        queryClient.invalidateQueries({ queryKey: ['CategoryServiceList'] });
        closeModal();
        Swal.fire({
          title: 'Success!',
          text: 'Successfully edit category name',
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
        text: 'Failed to add service. Please try again in a few mins.',
        error,
        icon: 'error',
      });
    },
  });

  useEffect(() => {
    if (categoryName) {
      reset({ categoryName: categoryName.category_name });
    }
  }, [categoryName, reset]);

  return (
    <Modal show={showEditCategoryModal} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '20px' }}>
          <p className="mb-0">Edit Category {categoryName.category_name}</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="EditCategory" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                {...register('categoryName', { required: '...' })}
                isInvalid={!!errors.service}
                size="sm"
                type="text"
                defaultValue={categoryName.category_name}
              />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant="outline-primary" form="EditCategory">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
