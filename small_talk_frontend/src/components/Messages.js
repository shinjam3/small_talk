import React, { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { GroupContext } from "../contexts/GroupContext";

import Header from "./Header";
import RenderGroups from "./RenderGroups";

function Messages({ history }) {
  const { user, getCurrentUserInfo } = useContext(UserContext);
  const { getGroups, createNewGroup } = useContext(GroupContext);

  useEffect(() => {
    getGroups(user._id);
    getCurrentUserInfo(user._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    createNewGroup(user._id);
  };

  return (
    <div>
      <Header history={history} />

      <div className="content-body">
        <button className="st-button" onClick={handleClick}>
          New Group
        </button>
        <div className="messages-container">
          <RenderGroups history={history} />
        </div>
      </div>
    </div>
  );
}

export default Messages;
