import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

import st_big from '../media/st_big.png';

function Login() {
  const navigate = useNavigate();
  const { getLoggedIn } = useContext(UserContext);

  const [loginErrorClass, setErrorClass] = useState('register-validation-error');
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    pass: '',
  });

  const handleChange = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(loginInfo),
    });
    if (res.ok) {
      await getLoggedIn();
      navigate('/dashboard');
    } else setErrorClass('register-validation-error show');
  };

  return (
    <div className="login-container">
      <img className="login-logo" src={st_big} alt="Small Talk Logo" />

      <h1 className="login-heading">The Simplest Online Messaging Platform</h1>
      <h1 className="login-heading">Create Groups Chats Without Phone Numbers</h1>

      <div className={loginErrorClass}>
        <p>The sign in information is incorrect.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-h2">Sign In</h2>
        <input className="login-input" name="email" type="text" placeholder="Email" onChange={handleChange} />
        <input className="login-input" name="pass" type="password" placeholder="Password" onChange={handleChange} />
        <div className="login-button-container">
          <button className="st-button" type="submit">
            Sign In
          </button>
          <Link className="st-button" to="/register">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
