import { useState } from 'react';

import { Button, Modal, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export default function EditStaffAccount({ showMods, closeMods, staffUserID }) {
  const [validated, setValidated] = useState(false);

  const [staffName, setStaffName] = useState('');
  const [staffLastName, setStaffLastName] = useState('');
  const [staffUserName, setStaffUserName] = useState('');
  const [staffUserpass, setStaffUserpass] = useState('');

  const closeModal = () => {
    closeMods();
    setValidated(false);
  };

  const updateStaffAccnt = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (staffName != '' && staffLastName != '' && staffUserName != '' && staffUserpass != '') {
      try {
        const data = { staffUserID, staffName, staffLastName, staffUserName, staffUserpass };
        const response = await axios.post(process.env.REACT_APP_UPDATESTAFFACCOUNT, data);
        console.log('success updating staff account: ', response.data);
        setValidated(false);
        closeModal();
      } catch (error) {
        console.err('error updating staff account :', error);
      }
    }
  };

  return (
    <>
      <Modal show={showMods} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '20px' }}>
            <p className="mb-0">Edit Staff Account </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="updateStaffID" noValidate validated={validated} onSubmit={updateStaffAccnt}>
            <Row>
              <Form.Group as={Col} controlId="validationCustom01">
                <Form.Label className="mt-3">Name</Form.Label>
                <Form.Control
                  required
                  //   ref={currentPass}
                  onChange={(event) => setStaffName(event.target.value)}
                  type="text"
                  placeholder="Name"
                />
                <Form.Control.Feedback type="invalid">Enter Name.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom02">
                <Form.Label className="mt-3">Last Name</Form.Label>
                <Form.Control
                  required
                  //   ref={currentPass}
                  onChange={(event) => setStaffLastName(event.target.value)}
                  type="text"
                  placeholder="Last Name"
                />
                <Form.Control.Feedback type="invalid">Enter Last Name.</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="validationCustom03">
                <Form.Label className="mt-3">Username</Form.Label>
                <Form.Control
                  required
                  onChange={(event) => setStaffUserName(event.target.value)}
                  type="text"
                  placeholder="Username"
                />
                <Form.Control.Feedback type="invalid">Enter Username.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="validationCustom04">
                <Form.Label className="mt-3"> New Password</Form.Label>
                <Form.Control
                  required
                  onChange={(event) => setStaffUserpass(event.target.value)}
                  type="password"
                  placeholder="Password"
                />
                <Form.Control.Feedback type="invalid">Enter new password.</Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" form="updateStaffID">
            Save
          </Button>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
