import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/login.css";
// import  Alert  from 'bootstrap';

import Alert from "react-bootstrap/Alert";

export default function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPass, setUserpass] = useState("");
  const [alertMsge, setAlertMsge] = useState(false);

  useEffect(() => {
    console.log("API LOGIN - " + process.env.REACT_APP_LOGIN);
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      navigate("/dashboard");
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
      console.log("Post successful:", response.data);

      if (response.data.message === "Success") {
        console.log("LOGGED In");

        const { token } = response.data;
        localStorage.setItem("authToken", token);
        console.log(token);
        navigate("/Dashboard");
      } else {
        setAlertMsge(true);
        console.log(alertMsge);
      }
    } catch (error) {
      console.error("Error posting data:", error);
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
              <span className="text-end">
                <a href="">I forgot my password</a>
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
