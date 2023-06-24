import React, { useContext, useState, useEffect } from 'react';
import { GroupContext } from '../contexts/GroupContext';
import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';

function GroupAddMember({ groupMembers, groupId, closeAddMember, groupAddContainer }) {
  const { getGroups } = useContext(GroupContext);
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const [popupClass, setPopupClass] = useState('st-popup');
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    let friends = [];
    let i;
    /* 
    goes through the group members array and filters the friends list,
    if a friend is already a group member
		*/
    for (i = 0; i < user.friends.length; i++) {
      if (groupMembers.findIndex((member) => member._id === user.friends[i]._id) === -1) {
        friends.push(user.friends[i]);
      }
    }
    setFriendsList(friends);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupMembers]);

  const handleClose = () => {
    closeAddMember();
  };

  const handleClick = async (e) => {
    // first param is current group _id, second param is friend's _id
    const res = await fetch(`${process.env.REACT_APP_API_URL}/groups/add-member`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ groupId, userId: e.target.id }),
    });
    if (res.ok) {
      setTimeout(() => {
        setPopupClass('st-popup');
      }, 3500);
      setPopupClass('st-popup show');
      getGroups();

      if (socket) {
        socket.emit('sendMessage', {
          message: {
            groupId: groupId,
            sentById: e.target.id,
            sentBy: 'smalltalk_system',
            body: e.target.name + ' has entered the group.',
            dateSent: new Date().toLocaleDateString(),
            timeSent: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        });
      }
    }
  };

  return (
    <div className={groupAddContainer}>
      <div className="group-settings-close" onClick={handleClose}>
        <p>&#x2715;</p>
      </div>
      <p>Add Group Member</p>
      <div className="group-add-friends-container">
        {friendsList.map((friend) => {
          return (
            <button
              key={friend._id}
              id={friend._id}
              name={friend.firstName + ' ' + friend.lastName}
              onClick={handleClick}
            >
              {friend.firstName + ' ' + friend.lastName}
            </button>
          );
        })}
      </div>

      <div className={popupClass}>New Member Added.</div>
    </div>
  );
}

export default GroupAddMember;
