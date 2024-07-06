import { useForm } from 'react-hook-form';
import { Button, Modal, Row, Form, Col } from 'react-bootstrap';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AddPatient({ showModal, closeModal }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log({ data });
    const name = data.name;
    const lastName = data.lastName;
    const address = data.address;
    const email = data.email;
    const gender = data.gender;
    const number = data.number;
    const DOB = data.DOB;

    newPatient.mutate({ name, lastName, address, email, gender, number, DOB });
  };

  const addNewPatient = async ({ name, lastName, address, email, gender, number, DOB }) => {
    const response = await axios.post(process.env.REACT_APP_ADDNEWPATIENT, { name, lastName, address, email, gender, number, DOB });
    return response.data;
  };

  const queryClient = useQueryClient();
  const newPatient = useMutation({
    mutationFn: addNewPatient,
    onSuccess: (data) => {
      if (data.message === 'success') {
        queryClient.invalidateQueries({ queryKey: ['patientList'] });
        closeModal();
        reset();
        Swal.fire({
          title: 'Success!',
          text: 'Successfully added a patient.',
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
      console.error('Error adding patient:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add patient. ' + error,
        icon: 'error',
      });
    },
  });

  const handleCloseModal = () => {
    closeModal();
    reset();
  };

  return (
    <>
      <Modal size="lg" show={showModal} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Add Patient </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="addPatient" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Name" {...register('name', { required: '...' })} isInvalid={!!errors.name} type="text" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control placeholder="Last Name" {...register('lastName', { required: '...' })} isInvalid={!!errors.lastName} type="text" />
              </Form.Group>
            </Row>

            <Row className="mt-3">
              <Form.Group as={Col}>
                <Form.Label>Address</Form.Label>
                <Form.Control placeholder="Address" {...register('address')} type="text" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <Form.Control placeholder="Email" {...register('email')} type="email" />
              </Form.Group>
            </Row>

            <Row className="mt-3">
              <Form.Group as={Col} md="3" controlId="validationCustom05">
                <Form.Label>Gender</Form.Label>
                <Form.Select aria-label="Default select example" {...register('gender')}>
                  <option value="">Select ---</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom06">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="number" placeholder="Phone number" {...register('number')} />
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom07">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" placeholder="" {...register('DOB')} />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" form="addPatient">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
