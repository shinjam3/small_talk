import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function NotificationItem({ notification }) {
  const { getCurrentUserInfo } = useContext(UserContext);

  // first param is user from, second param is current notification's id
  const acceptRequest = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/request-accepted`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        userFromId: notification.from._id,
        notificationId: notification._id,
      }),
    });
    if (res.ok) await getCurrentUserInfo();
  };

  const declineRequest = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/request-declined/${notification._id}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
    });
    if (res.ok) await getCurrentUserInfo();
  };

  return (
    <div className="notifications-item-container">
      <div className="notification-half">
        <div className="notification-top">
          <p className="notification-p bold">Friend Request</p>
          <p className="notification-p bold">{notification.dateCreated + ' ' + notification.timeCreated}</p>
        </div>

        <div className="notification-bottom">
          <p className="notification-p">{notification.body}</p>
        </div>
      </div>

      <div className="notification-second-half">
        <button className="notification-request-button" onClick={acceptRequest}>
          Accept
        </button>
        <button className="notification-request-button" onClick={declineRequest}>
          Decline
        </button>
      </div>
    </div>
  );
}

export default NotificationItem;
