import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const { socket, clearSocket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [popupClass, setPopupClass] = useState('st-popup');
  const [pass, setPass] = useState('');
  const [aboutClass, setAboutClass] = useState('settings-bottom');
  const [helpClass, setHelpClass] = useState('settings-bottom');
  const [deactivateClass, setDeactivate] = useState('settings-bottom');

  const handleAbout = () => {
    setAboutClass('settings-bottom show about');
  };

  const handleCloseAbout = () => {
    setAboutClass('settings-bottom');
  };

  const handleHelp = () => {
    setHelpClass('settings-bottom show help');
  };

  const handleCloseHelp = () => {
    setHelpClass('settings-bottom');
  };

  const handleDeactivate = () => {
    setDeactivate('settings-bottom show');
  };

  const handleCancelDeactivate = () => {
    setDeactivate('settings-bottom');
    setPass('');
  };

  const handleChange = (e) => {
    setPass(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/delete-account`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ pass }),
    });
    if (res.ok) {
      if (socket) socket.emit('logOut');
      clearSocket();
      navigate('/account-deleted');
    } else {
      setTimeout(() => {
        setPopupClass('st-popup');
      }, 3500);
      setPopupClass('st-popup show');
    }
  };

  return (
    <div>
      <h1 className="st-h1">Settings</h1>
      <div className="settings-container">
        <div className="settings-item">
          <p className="settings-p" onClick={handleAbout}>
            About
          </p>

          <div className={aboutClass}>
            <p className="settings-p-about center">Small Talk</p>
            <p className="settings-p-about">
              The web app was initially created by James Shin in January, 2021. Experience real-time messaging, through
              the use of WebSocket connections.
            </p>
            <p className="settings-p-about">
              While most other group chat applications require registering a phone number, Small Talk can be used by
              registering with just a unique email address.
            </p>
            <p className="settings-p-about">
              This application is non-commercial nor for sale, as it is a personal project.
            </p>
            <button className="settings-button" onClick={handleCloseAbout}>
              Close
            </button>
          </div>
        </div>

        <div className="settings-item">
          <p className="settings-p" onClick={handleHelp}>
            Help
          </p>

          <div className={helpClass}>
            <p className="settings-p-about center">
              <b>Adding Friends</b>
            </p>
            <p className="settings-p-about">
              Click/tap on the "Connect" tab, located in the navigation menu. From there, you will see a list of all the
              Small Talk users. Simply press on the "Add Friend" button to send a friend request to a specific user.
            </p>
            <p className="settings-p-about center">
              <b>Messaging Friends</b>
            </p>
            <p className="settings-p-about">
              To send messages to friends, you must first create a group. You can create a group by clicking/tapping on
              the "Messages" tab, located in the navigation, followed by pressing on the "New Group" button. Another way
              to create a group with a friend is by pressing on the "Message" button beside a friend's name.
            </p>
            <p className="settings-p-about center">
              <b>Adding Friends to New Groups</b>
            </p>
            <p className="settings-p-about">
              Click/tap on the group that you would like to add friends to. Then, you will see a "plus" (+) button at
              the top of the page. Press on the button to open a list of your friends. Simply click/tap on the friend's
              name to add that friend to the group.
            </p>
            <p className="settings-p-about center">
              <b>Password/Email Resetting</b>
            </p>
            <p className="settings-p-about">
              Currently, a forgotten email/password cannot be retrieved or reset on Small Talk. Please store your
              account information somewhere private, in case you forget your account information.
            </p>
            <button className="settings-button" onClick={handleCloseHelp}>
              Close
            </button>
          </div>
        </div>

        <div className="settings-item">
          <p className="settings-p" onClick={handleDeactivate}>
            Delete Account
          </p>

          <div className={deactivateClass}>
            <p className="settings-deactivate-p">
              Warning: your information and messages will be permanently erased if you delete your account.
            </p>
            <p className="settings-deactivate-p">Enter your password below to confirm your account's de-activation.</p>
            <form className="settings-form" onSubmit={handleSubmit}>
              <input type="password" onChange={handleChange} value={pass} placeholder="Password" />
              <div>
                <button type="submit">Confirm</button>
                <button type="button" onClick={handleCancelDeactivate}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className={popupClass}>Incorrect password provided.</div>
    </div>
  );
}

export default Settings;
