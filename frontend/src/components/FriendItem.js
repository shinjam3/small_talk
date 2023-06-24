import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { GroupContext } from '../contexts/GroupContext';
import silhouette from '../media/silhouette.png';
import { useNavigate } from 'react-router-dom';

function FriendItem({ friend }) {
  const { removeFriend } = useContext(UserContext);
  const { addToGroups } = useContext(GroupContext);
  const navigate = useNavigate();
  const [warningClass, setWarning] = useState('delete-friend-warning');

  const createGroup = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/groups/create-group-with-friend`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ friendId: friend._id }),
    });
    const resJson = await res.json();
    addToGroups(resJson);
    navigate(`/group/${resJson._id}`);
  };

  const showWarning = () => {
    setWarning('delete-friend-warning show');
  };

  const cancelClick = () => {
    setWarning('delete-friend-warning');
  };

  const confirmClick = async () => {
    await removeFriend(friend._id);
  };

  return (
    <div>
      <div className="connect-user">
        <img className="connect-img" src={silhouette} alt="profile silhouette" />
        <p className="connect-user-name">{friend.firstName + ' ' + friend.lastName}</p>
        <button className="connect-user-button friend" onClick={createGroup}>
          Message
        </button>
        <button className="connect-user-button friend" onClick={showWarning}>
          Remove Friend
        </button>
      </div>

      <div className={warningClass}>
        <p>Are you sure you want to remove your friend?</p>
        <div>
          <button onClick={confirmClick}>Yes</button>
          <button onClick={cancelClick}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default FriendItem;
