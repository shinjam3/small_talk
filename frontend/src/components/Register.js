import React, { useState } from 'react';
import Joi from 'joi-browser';

import st_big from '../media/st_big.png';
import { useNavigate } from 'react-router-dom';

/* 	
	Must have a number
	Must contain at least one upper-case
	Must contain at least one lower-case
	Must contain any of the following symbols [@$!%*?&]
	Should be at least 8 characters long
*/
const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function Register() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loginContainerClass, setContainerClass] = useState('login-container');
  const [termsClass, setTermsClass] = useState('register-terms');
  const [validationErrorClass, setErrorClass] = useState('register-validation-error');
  const [errorMsgs, setErrorMsgs] = useState([]);
  const [confirmPass, setConfirmPass] = useState([]);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    pass: '',
    friends: [],
    notifications: [],
  });

  // validation schema
  const schema = {
    firstName: Joi.string().required().label('First Name'),
    lastName: Joi.string().required().label('Last Name'),
    email: Joi.string().email().required().label('Email'),
    pass: Joi.string().regex(regEx).required().label('Password'),
    friends: Joi.array().required(),
    notifications: Joi.array().required(),
  };

  // user validation
  const userValidation = () => {
    const result = Joi.validate(userInfo, schema, {
      abortEarly: false,
    });

    let tempArray = [],
      joiArray = [],
      termsArray = [];

    // user must agree to terms and conditions
    if (!termsAgreed) termsArray.push('Please agree to the terms & conditions before signing up.');

    // if Joi validation was not satisfied then add requirements to the joiArray
    if (result.error) {
      setContainerClass('login-container error');
      setErrorClass('register-validation-error show');

      tempArray = result.error.details.map((obj) => obj.message);
      tempArray.forEach((str) => {
        if (str.includes('required pattern')) {
          joiArray.push(
            <div>
              <p>"Password" must satisfy the following requirements:</p>
              <ul>
                <li>Must have a number</li>
                <li>Must contain at least one upper-case</li>
                <li>Must contain at least one lower-case</li>
                <li>Must contain any of the following symbols: @$!%*?&</li>
                <li>Must be at least 8 characters long</li>
              </ul>
            </div>
          );
        } else joiArray.push(str);
      });

      if (userInfo.pass !== confirmPass) {
        termsArray.push('Please make sure your passwords match');
      }
      setErrorMsgs([...joiArray, ...termsArray]);
      return false;
    } else {
      // checks to see if confirmation password matches
      if (userInfo.pass !== confirmPass) {
        termsArray.push('Please make sure your passwords match');
        setContainerClass('login-container error');
        setErrorClass('register-validation-error show');
        setErrorMsgs([...joiArray, ...termsArray]);
        return false;
      }
      if (termsArray.length) {
        setContainerClass('login-container error');
        setErrorClass('register-validation-error show');
        setErrorMsgs([...joiArray, ...termsArray]);
        return false;
      } else {
        setContainerClass('login-container');
        setErrorClass('register-validation-error');
        setErrorMsgs([]);
      }
      return true;
    }
  };

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmPassChange = (e) => {
    setConfirmPass(e.target.value);
  };

  const showTerms = () => {
    setTermsClass('register-terms show');
  };

  const closeTerms = () => {
    setTermsClass('register-terms');
  };

  const handleCheck = (e) => {
    setTermsAgreed(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userValidation()) {
      fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(userInfo),
      })
        .then((res) => {
          if (!res.ok) return res.text();
          else setRegistered(true);
        })
        .then((res) => {
          if (!res) return;
          else {
            setErrorClass('register-validation-error show');
            setErrorMsgs([res]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const conditionalRender = () => {
    if (registered) {
      return (
        <div className="login-container registered">
          <h3>
            Thank you for registering. Click{' '}
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
              <u>here</u>
            </span>{' '}
            to sign into your account.
          </h3>
        </div>
      );
    } else {
      return (
        <div className={loginContainerClass}>
          <img className="login-logo" src={st_big} alt="Small Talk logo" />

          <h1 className="login-heading">All you need is internet in order to chat with other users</h1>

          <div className={validationErrorClass}>
            {errorMsgs.map((msg) => (
              <div key={(Math.random() * 1000).toString()} style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                {msg}
              </div>
            ))}
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-h2">Register</h2>

            <input
              className="login-input"
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
              value={userInfo.firstName}
            />
            <input
              className="login-input"
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
              value={userInfo.lastName}
            />
            <input
              className="login-input"
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={userInfo.email}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              name="pass"
              onChange={handleChange}
              value={userInfo.pass}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Confirm Password"
              onChange={handleConfirmPassChange}
              value={confirmPass}
            />

            <div className="login-accept-div">
              <input className="login-accept-input" type="checkbox" onChange={handleCheck} />
              <p>
                {' '}
                I accept the{' '}
                <span onClick={showTerms}>
                  <u>Terms & Conditions</u>
                </span>
                .
              </p>
            </div>

            <button className="st-button" type="submit">
              Register
            </button>
          </form>

          <div className={termsClass}>
            <h2>Terms & Conditions</h2>
            <p>Your password will be encrypted in our database.</p>
            <p>
              However, we strongly recommend that you register with an email and password that you do not use for any
              other service.
            </p>
            <p>Please note that your account information cannot be reset if you forget your email or password.</p>
            <button onClick={closeTerms}>I Understand</button>
          </div>
        </div>
      );
    }
  };

  return <div>{conditionalRender()}</div>;
}

export default Register;
