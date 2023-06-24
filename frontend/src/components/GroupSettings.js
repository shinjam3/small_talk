import React, { useContext, useState } from 'react';
import { GroupContext } from '../contexts/GroupContext';
import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';

function GroupSettings({ closeGroupSettings, groupSettingsContainer, groupMembers, groupId, history }) {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const { leaveGroup } = useContext(GroupContext);
  const navigate = useNavigate();

  const [membersClass, setMembersClass] = useState('group-settings-bottom');
  const [leaveClass, setLeaveClass] = useState('group-settings-bottom');

  const closeSettings = () => {
    closeGroupSettings();
  };

  const expandMembers = () => {
    setMembersClass('group-settings-bottom show-expand');
  };

  const closeMembers = () => {
    setMembersClass('group-settings-bottom');
  };

  const expandLeaveGroup = () => {
    setLeaveClass('group-settings-bottom show-expand');
  };

  const closeLeaveGroup = () => {
    setLeaveClass('group-settings-bottom');
  };

  const handleLeaveGroup = async () => {
    if (socket) {
      socket.emit('sendMessage', {
        message: {
          groupId,
          sentBy: 'smalltalk_system',
          body: user.firstName + ' has left the group.',
          dateSent: new Date().toLocaleDateString(),
          timeSent: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      });
    }
    await leaveGroup(groupId);
    navigate('/dashboard');
  };

  return (
    <div className={groupSettingsContainer}>
      <div className="group-settings-item">
        <div className="group-settings-close" onClick={closeSettings}>
          <p>&#x2715;</p>
        </div>
        <div className="group-settings-top">
          <p className="group-settings-p" onClick={expandMembers}>
            Members
          </p>
        </div>
        <div className={membersClass}>
          <p>{groupMembers.map((member) => member.firstName).join(', ')}</p>
          <p className="group-settings-shrink" onClick={closeMembers}>
            ^
          </p>
        </div>
      </div>

      <div className="group-settings-item">
        <p className="group-settings-p" onClick={expandLeaveGroup}>
          Leave Group
        </p>
        <div className={leaveClass}>
          <p>Are you sure you want to leave this group?</p>
          <div>
            <button onClick={handleLeaveGroup}>Yes</button>
            <button onClick={closeLeaveGroup}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupSettings;
