import React, { useContext, useEffect, useState } from 'react';
import { GroupContext } from '../contexts/GroupContext';
import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';

function GroupItem({ group }) {
  const navigate = useNavigate();
  const { leaveGroup } = useContext(GroupContext);
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const [members, setMembers] = useState([]);
  const [messagesIconClass, setIconClass] = useState('messages-icon');
  const [deleteWarningClass, setWarningClass] = useState('messages-warning');
  const [latestMessage, setLatestMessage] = useState({
    sentBy: '',
    body: '',
    dateSent: '',
    timeSent: '',
  });

  useEffect(() => {
    // fetches latest message for the group as a message preview
    const getMessagesPreview = async () => {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ groupId: group._id, preview: true }),
      });
      const resJson = await res.json();
      if (!resJson) {
        setLatestMessage({
          sentBy: '',
          body: 'New Group',
          dateSent: new Date().toLocaleDateString(),
          timeSent: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      } else {
        if (!resJson.sentBy) {
          setLatestMessage({
            sentBy: resJson.sentBy,
            body: resJson.body,
            dateSent: resJson.dateSent,
            timeSent: resJson.timeSent,
          });
        } else {
          setLatestMessage({
            sentBy: resJson.sentBy + ':',
            body: resJson.body,
            dateSent: resJson.dateSent,
            timeSent: resJson.timeSent,
          });
        }
      }
    };

    getMessagesPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMembers(group.members.map((member) => member.firstName));
  }, [group]);

  const handleClick = () => {
    navigate(`/group/${group._id}`);
  };

  const showWarning = () => {
    setIconClass('messages-icon hide');
    setWarningClass('messages-warning show');
  };

  // todo: get rid of user._id
  const deleteGroup = async () => {
    await leaveGroup(group._id);
    if (socket) {
      socket.emit('sendMessage', {
        message: {
          groupId: group._id,
          sentById: user._id,
          sentBy: 'smalltalk_system',
          body: user.firstName + ' has left the group.',
          dateSent: new Date().toLocaleDateString(),
          timeSent: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
    }
  };

  const cancelDelete = () => {
    setIconClass('messages-icon');
    setWarningClass('messages-warning');
  };

  return (
    <div className="messages-content">
      <div className="messages-content-first-half" onClick={handleClick}>
        <div className="messages-half">
          <p className="messages-p members">{members.join(',')}</p>
          <p className="messages-p date">{latestMessage.dateSent + ' ' + latestMessage.timeSent}</p>
        </div>

        <div className="messages-half">
          <p className="messages-p message">{latestMessage.sentBy + ' ' + latestMessage.body}</p>
        </div>
      </div>

      <div className="messages-content-second-half">
        <p className={messagesIconClass} onClick={showWarning}>
          &#128465;
        </p>
        <div className={deleteWarningClass}>
          <p>Are you sure?</p>
          <div>
            <button onClick={deleteGroup}>Yes</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupItem;
