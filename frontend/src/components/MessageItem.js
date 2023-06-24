import React, { useContext, useState, useEffect } from 'react';
import { GroupContext } from '../contexts/GroupContext';
import { UserContext } from '../contexts/UserContext';

function MessageItem({ message }) {
  const { getGroups } = useContext(GroupContext);
  const { user } = useContext(UserContext);
  const [messageItemClass, setItemClass] = useState('');

  useEffect(() => {
    if (message.body.includes('has left the group.')) getGroups();
    if (user.firstName === message.sentBy) {
      setItemClass('text-box sent');
    } else {
      setItemClass('text-box received');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className={messageItemClass}>
      <div className="text-box-top">
        <p>{message.sentBy}</p>
        <p>{message.dateSent + ' ' + message.timeSent}</p>
      </div>

      <p className="text-box-body">{message.body}</p>
    </div>
  );
}

export default MessageItem;
