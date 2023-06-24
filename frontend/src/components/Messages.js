import React, { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { GroupContext } from '../contexts/GroupContext';

import Header from './Header';
import RenderGroups from './RenderGroups';

function Messages() {
  const { getCurrentUserInfo } = useContext(UserContext);
  const { getGroups, createNewGroup } = useContext(GroupContext);

  useEffect(() => {
    getGroups();
    getCurrentUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    createNewGroup();
  };

  return (
    <div>
      <Header />
      <div className="content-body">
        <button className="st-button" onClick={handleClick}>
          New Group
        </button>
        <div className="messages-container">
          <RenderGroups />
        </div>
      </div>
    </div>
  );
}

export default Messages;
