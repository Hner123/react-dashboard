import Header from "../components/Header";
import SidePanel from "../components/SidePanel";
import "../style/profile.css";
import { Button, Modal, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { useState, useEffect } from "react";

export default function Profile() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);

  const [preload, setPreload] = useState(true);
  const [validated, setValidated] = useState(false);

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log("dashboard " + sidePanelOPen);
  };
  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />
      <div className="profile">
        <h5>Profile</h5>
        <div className="row">
          <div className="profileLayout col-md-6">
            <div style={{ borderBottom: "1px solid rgb(51 51 51 / 20%)" }}>
              <h5>Edt Profile</h5>
            </div>
            <div>
              <Form id="addPatientForm" noValidate validated={validated}>
                <Row>
                  <Form.Group as={Col} controlId="validationCustom01">
                    <Form.Label className="mt-3">First name</Form.Label>
                    <Form.Control required type="text" placeholder="First name" />
                    <Form.Control.Feedback type="invalid">Please enter a name.</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label className="mt-3">Last name</Form.Label>
                    <Form.Control required type="text" placeholder="Last name" />
                    <Form.Control.Feedback type="invalid">Please enter a last name.</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label className="mt-3">Email</Form.Label>
                    <Form.Control required type="email" placeholder="Please enter an email" />
                    <Form.Control.Feedback type="invalid">Please enter an email.</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label className="mt-3">Username</Form.Label>
                    <Form.Control required type="text" placeholder="Enter a username" />
                    <Form.Control.Feedback type="invalid">Enter a username.</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label className="mt-3">Password</Form.Label>
                    <Form.Control required type="password" placeholder="Enter a password" />
                    <Form.Control.Feedback type="invalid">Enter a password.</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label className="mt-3">New Password</Form.Label>
                    <Form.Control required type="password" placeholder="Enter new password" />
                    <Form.Control.Feedback type="invalid">Enter new password.</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label className="mt-3">Confirm Password</Form.Label>
                    <Form.Control required type="password" placeholder="Confirm password" />
                    <Form.Control.Feedback type="invalid">Confirm password.</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col className="d-flex justify-content-end p-0">
                      <Button type="submit" className="mt-3">
                        Update
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </Form>
            </div>
          </div>

          <div className="profileLayout col-md-6">
            <div style={{ borderBottom: "1px solid rgb(51 51 51 / 20%)" }}>
              <h5>Notification</h5>
            </div>
            <div>
              <Form.Group as={Row} controlId="validationCustom01" className="mt-4">
                <Form.Label column sm={2} className="">
                  Notification:
                </Form.Label>
                <Col sm={8}>
                  <Form.Control required type="email" placeholder="Enter your email to send notif" />
                </Col>
                <Col>
                  <Button>Save</Button>
                </Col>
              </Form.Group>
            </div>
            <div style={{ borderBottom: "1px solid rgb(51 51 51 / 20%)" }} className="mt-5">
              <h5>Add Staff</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
