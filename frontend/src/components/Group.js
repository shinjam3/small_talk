import React, { useContext, useState, useEffect } from 'react';
import { MessagesContext } from '../contexts/MessagesContext';
import { GroupContext } from '../contexts/GroupContext';
import { SocketContext } from '../contexts/SocketContext';

import GroupSettings from './GroupSettings';
import GroupAddMember from './GroupAddMember';
import RenderMessages from './RenderMessages';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function Group() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { clearMessages, addNewMessage, getMessages } = useContext(MessagesContext);
  const { groups, getGroups } = useContext(GroupContext);
  const { socket } = useContext(SocketContext);
  const { getCurrentUserInfo } = useContext(UserContext);
  const [groupSettingsClass, setSettingsClass] = useState('group-settings-container');
  const [groupAddMemberClass, setAddMemberClass] = useState('group-add-container');
  const [userIsInAGroup, setUserIsInAGroup] = useState(null);
  const [groupMembers, setMembers] = useState([]);
  const [groupMembersNames, setNames] = useState([]);
  const [message, setMessage] = useState({
    groupId,
    body: '',
    dateSent: '',
    timeSent: '',
  });

  /*
	checks if the current user's id is in the array of members.
	if the user's id is not in the array, then the page is re-directed to "Not Found"
	*/
  useEffect(() => {
    if (userIsInAGroup === null) return;
    else if (!groups.find((group) => group._id === groupId)) navigate('/not-found');
    else {
      getMessages(groupId);
      const groupArray = groups.find((group) => group._id === groupId);
      setMembers(groupArray.members);
      setNames(groupArray.members.map((member) => member.firstName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIsInAGroup, groups, groupId]);

  useEffect(() => {
    if (Object.keys(socket).length) {
      // join specific socket with groupId
      socket.emit('joinGroup', { groupId });

      socket.on('newMessage', (message) => {
        addNewMessage(message);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      await getCurrentUserInfo();
      const res = await getGroups();
      setUserIsInAGroup(res);
    };
    fetchUserInfo();
    /*
			each time this component is mounted, a new "newMessage" listener will be added to this socket,
			so socket.removeAllListeners is called when the component is unmounted
    */
    return () => {
      if (Object.keys(socket).length) {
        socket.emit('exitGroup', { groupId });
        socket.removeAllListeners('newMessage');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    clearMessages();
    navigate('/dashboard/messages');
  };

  const handleGroupSettingsClose = () => {
    setSettingsClass('group-settings-container');
  };

  const selectSettings = () => {
    setSettingsClass('group-settings-container show');
  };

  const handleChange = (e) => {
    setMessage({
      ...message,
      body: e.target.value,
    });
  };

  const showAddMember = () => {
    setAddMemberClass('group-add-container show');
  };

  const handleCloseAddMember = () => {
    setAddMemberClass('group-add-container');
  };

  const messageSent = async () => {
    if (message.body.trim().length > 0) {
      if (socket) {
        await socket.emit('sendMessage', {
          message: {
            ...message,
            dateSent: new Date().toLocaleDateString(),
            timeSent: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        });

        setMessage({
          ...message,
          body: '',
        });
      }
    }
  };

  return (
    <div>
      <div className="group-container">
        <div className="group-nav">
          <div className="group-nav-left-container">
            <div className="group-nav-back" onClick={goBack}>
              &#10094;
            </div>
            <h1 className="group-nav-h1">{groupMembersNames.join(', ')}</h1>
            <div className="group-nav-add" onClick={showAddMember}>
              &#65291;
            </div>
          </div>
          <div className="group-nav-settings-button" onClick={selectSettings}>
            ⚙
          </div>
        </div>

        <div className="text-box-container">
          <RenderMessages />
        </div>

        <div className="group-footer">
          <textarea className="group-textarea" cols="50" value={message.body} onChange={handleChange} />
          <button className="group-send-button" onClick={messageSent}>
            Send
          </button>
        </div>
      </div>

      <GroupSettings
        groupSettingsContainer={groupSettingsClass}
        closeGroupSettings={handleGroupSettingsClose}
        groupId={groupId}
        groupMembers={groupMembers}
      />

      <GroupAddMember
        groupAddContainer={groupAddMemberClass}
        groupId={groupId}
        closeAddMember={handleCloseAddMember}
        groupMembers={groupMembers}
      />
    </div>
  );
}

export default Group;
