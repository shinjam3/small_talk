import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-2);
  };

  return (
    <div style={{ fontFamily: 'Courier New, Courier, monospace' }}>
      <h1 style={h1Style}>Page Not Found.</h1>
      <button style={btnStyle} onClick={handleClick}>
        Go Back
      </button>
    </div>
  );
}

const h1Style = {
  textAlign: 'center',
  margin: '75px',
  marginBottom: '20px',
};

const btnStyle = {
  display: 'block',
  margin: 'auto',
  padding: '10px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default NotFound;
