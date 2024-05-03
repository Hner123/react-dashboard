import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/login.css';
// import  Alert  from 'bootstrap';
import Form from 'react-bootstrap/Form';

import Alert from 'react-bootstrap/Alert';

export default function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userPass, setUserpass] = useState('');
  const [alertMsge, setAlertMsge] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const userID = localStorage.getItem('user');
    if (storedToken) {
      navigate('/dashboard');
    }
  }, []);

  const handleUsername = (event) => {
    setUserName(event.target.value);
  };
  const handlePassword = (event) => {
    setUserpass(event.target.value);
  };

  const handlePost = async () => {
    try {
      const postData = { userName, userPass };
      const response = await axios.post(process.env.REACT_APP_LOGIN, postData);

      if (response.data.message === 'Success') {
        console.log('LOGGED In');

        const { token } = response.data;
        const userID = response.data.id;
        const userName = response.data.name;

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', userID);
        localStorage.setItem('userName', userName);
        localStorage.setItem('role', response.data.role);

        navigate('/Dashboard');
      } else {
        setAlertMsge(true);
        console.log(alertMsge);
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePost();
  };

  const handleAlertClose = () => {
    setAlertMsge(false);
  };

  return (
    <div className="loginPage">
      <div className="container d-flex align-items-center justify-content-center">
        <div>
          <form onSubmit={handleSubmit}>
            {alertMsge ? (
              <Alert variant="danger" dismissible onClose={handleAlertClose}>
                Invalid Credentials!
              </Alert>
            ) : (
              console.log(alertMsge)
            )}

            <h3>Login</h3>

            <div className="col-md-12">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={userName}
                onChange={handleUsername}
                placeholder="Enter username"
                required
              />
              <div className="invalid-feedback">Please enter a Username</div>
            </div>
            <div className="text-end"></div>

            <div className="col-md-12 form-pass mt-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <span style={{ width: '100%' }} className="text-end">
                <input
                  style={{ position: 'relative', top: '2px', marginRight: '6px' }}
                  id="chck"
                  type="checkbox"
                />

                <label htmlFor="chck" style={{ color: '#2266D7' }}>
                  Remember me
                </label>
              </span>

              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={userPass}
                onChange={handlePassword}
                placeholder="Enter password"
                required
              />
              <div className="invalid-feedback">Please enter a Password</div>
            </div>

            <div className="mt-3 text-center">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
