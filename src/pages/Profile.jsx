import Header from '../components/Header';
import SidePanel from '../components/SidePanel';
import '../style/profile.css';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import EditStaffAccount from '../components/EditStaffAccount';
import BlockDateModal from '../components/BlockDateModal';

export default function Profile() {
  const [sidePanelOPen, setSidePanelOPen] = useState(true);

  const [preload, setPreload] = useState(true);
  const [validated, setValidated] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const [staffName, setStaffName] = useState('');
  const [stafLastname, setStafLastname] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffID, setStaffID] = useState();

  const [userCurrentPass, setUserCurrentPass] = useState('');
  const [userNewPass, setUserNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPass, setIsLoadingPass] = useState(false);

  const currentPass = useRef(null);
  const newPass = useRef(null);
  const newConfirmPass = useRef(null);

  const togglePanel = () => {
    setSidePanelOPen(!sidePanelOPen);
    console.log('dashboard ' + sidePanelOPen);
  };

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
  };

  const fetchUserDetails = async () => {
    try {
      const userID = localStorage.getItem('user');
      const data = { userID };
      const response = await axios.post(process.env.REACT_APP_PROFILE, data);

      setFirstName(response.data.user_Accounts[0].name);
      setLastName(response.data.user_Accounts[0].lastname);
      setUserEmail(response.data.user_Accounts[0].email);
      setUserName(response.data.user_Accounts[0].username);

      setStaffName(response.data.staff_Accounts[0].name);
      setStafLastname(response.data.staff_Accounts[0].lastname);
      setStaffUsername(response.data.staff_Accounts[0].username);
      setStaffID(response.data.staff_Accounts[0].id);
    } catch (error) {
      console.log('Error fetching user :', error);
    } finally {
      setPreload(false);
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (firstName != '' && lastName != '' && userEmail != '' && userName != '') {
      try {
        setIsLoading(true);
        const userID = localStorage.getItem('user');
        const data = { userID, firstName, lastName, userEmail, userName };
        const response = await axios.post(process.env.REACT_APP_PROFILEUPDATE, data);
        console.log('succesfully update profile :' + response.data);
      } catch (error) {
        console.log('Error updating profile :', error);
      } finally {
        setValidated(false);
        setIsLoading(false);
      }
    }
  };

  const [closedList, setCloseList] = useState([]);
  const [blockDateUpdate, setBlockDateUpdate] = useState('');
  const getHoliday = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_HOLIDAYLIST);
      console.log('date of closed branch: ', response.data.holiday);
      setCloseList(response.data.holiday);
    } catch (error) {
      console.log('failed to get holiday list: ', error);
    }
  };

  const deleteBlockingDate = async (id) => {
    try {
      const data = { id };
      const response = await axios.post(process.env.REACT_APP_DELETEBLOCKDATE, data);
      console.log('success deleting blocking date...', response.data);
      setBlockDateUpdate(response);
    } catch (error) {
      console.log('error deleting blocking date...', error);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setValidated(true);

    if (userNewPass === confirmPass && userNewPass != '' && confirmPass != '') {
      try {
        setIsLoadingPass(true);
        const userID = localStorage.getItem('user');
        const data = { userID, userCurrentPass, userNewPass };
        const response = await axios.post(process.env.REACT_APP_PROFILECHANGEPASS, data);
        const result = response.data;
        console.log('Changing password feedback :..' + result);
        if (result.trim() == 'Incorrect') {
          setShowAlertMessage('Incorrect Password!!!');
          setAlertVariant('danger');
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        } else {
          setValidated(false);
          setShowAlertMessage('Password Changed');
          setAlertVariant('success');
          setShowAlert(true);
          setUserCurrentPass('');
          setUserNewPass('');
          setConfirmPass('');

          currentPass.current.value = '';
          newPass.current.value = '';
          newConfirmPass.current.value = '';

          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        }
      } catch (error) {
        console.log('Error changing password :', error);
      } finally {
        setIsLoadingPass(false);
      }
    } else {
      if (userCurrentPass == '' || userNewPass == '' || confirmPass == '') {
        console.log('needs to be filled out.');
      } else {
        console.log("new and confirm password doesn't match");
        setShowAlertMessage("New and Confirm password doesn't match!");
        setAlertVariant('danger');
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [preload]);

  useEffect(() => {
    getHoliday();
  }, [blockDateUpdate]);

  return (
    <>
      <Header togglePanel={togglePanel} hamburgerClose={sidePanelOPen} preload={preload} />
      <SidePanel isOpen={sidePanelOPen} togglePanel={togglePanel} />
      <div className="profile">
        <h5>Profile</h5>
        <div className="row">
          <div className="profileLayout col-md-6">
            <div style={{ borderBottom: '1px solid rgb(51 51 51 / 20%)' }}>
              <h5>Edt Profile</h5>
            </div>
            <div>
              <Form noValidate validated={validated} onSubmit={updateProfile}>
                <Row>
                  <Form.Group as={Col} controlId="validationCustom01">
                    <Form.Label className="mt-3">First name</Form.Label>
                    <Form.Control
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      required
                      type="text"
                      placeholder="First name"
                    />
                    <Form.Control.Feedback type="invalid">Please enter a name.</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label className="mt-3">Last name</Form.Label>
                    <Form.Control
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      required
                      type="text"
                      placeholder="Last name"
                    />
                    <Form.Control.Feedback type="invalid">Please enter a last name.</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} controlId="validationCustom03">
                    <Form.Label className="mt-3">
                      Email{' '}
                      <span style={{ fontSize: '10px', color: 'grey' }}>
                        (This will be your email notification for booking...)
                      </span>
                    </Form.Label>
                    <Form.Control
                      value={userEmail}
                      onChange={(event) => setUserEmail(event.target.value)}
                      required
                      type="email"
                      placeholder="Please enter an email"
                    />
                    <Form.Control.Feedback type="invalid">Please enter an email.</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom04">
                    <Form.Label className="mt-3">Username</Form.Label>
                    <Form.Control
                      value={userName}
                      onChange={(event) => setUserName(event.target.value)}
                      required
                      type="text"
                      placeholder="Enter a username"
                    />
                    <Form.Control.Feedback type="invalid">Enter a username.</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col className="d-flex justify-content-end p-0">
                      <Button type="submit" variant="primary" disabled={isLoading} className="mt-3">
                        <Spinner
                          style={{ display: isLoading ? 'inline-block' : 'none' }}
                          animation="border"
                          size="sm"
                        />
                        &nbsp;
                        {isLoading ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </Form>

              <div className="mt-4" style={{ borderBottom: '1px solid rgb(51 51 51 / 20%)' }}>
                <h5>Change Password</h5>
              </div>

              <Form noValidate validated={validated} onSubmit={changePassword}>
                <Row>
                  {showAlert && (
                    <Alert variant={alertVariant} dismissible className="passwordAlert">
                      {showAlertMessage}
                    </Alert>
                  )}

                  <Form.Group as={Col} controlId="validationCustom05">
                    <Form.Label className="mt-3">Password</Form.Label>
                    <Form.Control
                      required
                      ref={currentPass}
                      onChange={(event) => setUserCurrentPass(event.target.value)}
                      type="password"
                      placeholder="Current password"
                    />
                    <Form.Control.Feedback type="invalid">Current password.</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom06">
                    <Form.Label className="mt-3">New Password</Form.Label>
                    <Form.Control
                      required
                      ref={newPass}
                      onChange={(event) => setUserNewPass(event.target.value)}
                      type="password"
                      placeholder="Enter new password"
                    />
                    <Form.Control.Feedback type="invalid">Enter new password.</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationCustom07">
                    <Form.Label className="mt-3">Confirm Password</Form.Label>
                    <Form.Control
                      required
                      ref={newConfirmPass}
                      onChange={(event) => setConfirmPass(event.target.value)}
                      type="password"
                      placeholder="Confirm password"
                    />
                    <Form.Control.Feedback type="invalid">Confirm password.</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col className="d-flex justify-content-end p-0">
                      <Button type="submit" variant="primary" disabled={isLoadingPass} className="mt-3">
                        <Spinner
                          style={{ display: isLoadingPass ? 'inline-block' : 'none' }}
                          animation="border"
                          size="sm"
                        />
                        &nbsp;
                        {isLoadingPass ? 'loading...' : 'Change Password'}
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </Form>
            </div>
          </div>

          <div className="notifLayout col-md-6">
            <div style={{ borderBottom: '1px solid rgb(51 51 51 / 20%)' }}>
              <h5>Staff Account</h5>
            </div>
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{staffName}</td>
                    <td>{stafLastname}</td>
                    <td>{staffUsername}</td>
                    <td>
                      <Button size="sm" onClick={() => setShowModal(true)}>
                        Edit Account
                      </Button>
                    </td>
                  </tr>
                </tbody>
                <EditStaffAccount showMods={showModal} closeMods={handleClose} staffUserID={staffID} />
              </Table>
            </div>

            <div style={{ borderBottom: '1px solid rgb(51 51 51 / 20%)' }} className="mt-5">
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5 className="m-0">Holiday, Closed</h5>
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                  <BlockDateModal setBlockDateUpdate={setBlockDateUpdate} />
                </div>
              </div>
            </div>
            <div style={{ height: '200px', overflowY: 'scroll' }}>
              <Table bordered hover>
                <thead className="profileTHead">
                  <tr>
                    <th>Id</th>
                    <th>Date</th>
                    <th>Remarks</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {closedList.map((list, index) => (
                    <tr className="rowTableList" key={index}>
                      <td>{list.id}</td>
                      <td>
                        {String(parseInt(list.Month) + 1).padStart(2, '0') + '/' + list.Day + '/' + list.Year}
                      </td>
                      <td>{list.Remarks}</td>
                      <td>{list.Branch}</td>
                      <td>
                        <Button
                          onClick={() => deleteBlockingDate(list.id)}
                          variant="danger"
                          className="deleteBtn"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
