// import "bootstrap/dist/css/bootstrap.min.css";
import '../style/header.css';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';

export default function Header({ togglePanel, hamburgerClose, preload }) {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const navigateProfile = useNavigate();
  const ref = useRef(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    setIsVisible(false);

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsVisible(false);
        console.log('ref check ' + !ref.current.contains(event.target));
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref]);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    navigate('/');
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    setUserName(localStorage.getItem('userName'));
    setUserRole(localStorage.getItem('role'));
    if (storedToken) {
      // Parse the token to get its expiration time
      const tokenData = JSON.parse(atob(storedToken.split('.')[1]));

      // Check if the token has expired
      if (tokenData.exp * 1000 > Date.now()) {
        console.log('checking count time - ' + tokenData.exp + ' ' + Date.now());
      } else {
        // Token has expired, perform logout
        handleLogout();
      }
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div>
      <LinearProgress
        style={{
          height: '6px',
          position: 'fixed',
          width: '100%',
          top: '80px',
          visibility: preload ? 'visible' : 'hidden',
        }}
      />

      <header className="Navheader d-flex justify-content-between">
        <label htmlFor="check" className="menuButton ms-4">
          <input id="check" type="checkbox" onChange={togglePanel} checked={!hamburgerClose} />
          <span className="top"></span>
          <span className="mid"></span>
          <span className="bot"></span>
        </label>
        <div className="col-md-6 d-flex align-items-center ms-5">
          <a href="/dashboard">
            <img
              src="https://res.cloudinary.com/djyf3qi4d/image/upload/v1709660941/Avenue-Dental-Logo_pkztgi.png"
              alt="avenue-dental-logo"
            />
          </a>
        </div>
        <div className="col-md-5 d-flex justify-content-end me-5">
          <div className="d-flex align-items-center">
            <div ref={ref}>
              <p className="profileName" onClick={toggleVisibility}>
                <span className="me-2">
                  <AccountCircleOutlinedIcon />
                </span>
                {userName}
                <span className="ms-2">
                  <ArrowDropDownOutlinedIcon />
                </span>
              </p>

              <ul className={isVisible ? 'show' : 'hide'}>
                {userRole === 'admin' && (
                  <li>
                    <PersonOutlineOutlinedIcon fontSize="small" />
                    <span className="ms-2" onClick={() => navigateProfile('/profile')}>
                      Profile
                    </span>
                  </li>
                )}

                {/* <li>
                  <SettingsSuggestOutlinedIcon fontSize="small" />
                  <span className="ms-2">Settings</span>
                </li> */}
                <li>
                  <ExitToAppOutlinedIcon fontSize="small" />
                  <span className="ms-2" onClick={handleLogout}>
                    Logout
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
