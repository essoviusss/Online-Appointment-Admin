import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAuth(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!isLoggedIn && token === null) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out!");
    navigate("/", { replace: true });
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Determine the content based on the current page
  let headerContent = '';
  if (location.pathname === '/Appointment') {
    headerContent = '> Create an appointment';
  } else if (location.pathname === '/ViewAppointment') {
    headerContent = '> View Appointment';
  }

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        color: '#025BAD',
        padding: '10px',
        paddingLeft: 0,
        marginLeft: 0,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        height: '60px',
        zIndex: '99',
        '@media(max-width: 768px)': {
          flexDirection: 'column',
          justifyContent: 'center',
          height: 'auto',
          padding: '20px'
        },
      }}
    >
      <div style={{ marginLeft: '20px', fontWeight: 'bold' }}>{headerContent}</div> 
      <div style={{ cursor: 'pointer', position: 'relative' }} onClick={handleDropdownClick}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#025BAD',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <FontAwesomeIcon icon={faUser} />
        </div>
        {isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '60px',
              right: '0px',
              backgroundColor: 'white',
              padding: '10px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              borderRadius: '5px',
              zIndex: 1,
              width: '150px'
            }}
          >
            <div style={{ cursor: 'pointer' }} onClick={() => console.log('Profile clicked')}>
              Profile
            </div>
            <div style={{ cursor: 'pointer' }} onClick={logout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
