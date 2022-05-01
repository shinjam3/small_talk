import React, { useContext, useState, useEffect } from "react";
import { MessagesContext } from "../contexts/MessagesContext";
import { GroupContext } from "../contexts/GroupContext";
import { UserContext } from "../contexts/UserContext";
import { SocketContext } from "../contexts/SocketContext";

import GroupSettings from "./GroupSettings";
import GroupAddMember from "./GroupAddMember";
import RenderMessages from "./RenderMessages";

function Group({ match, history }) {
  const { clearMessages, addNewMessage } = useContext(MessagesContext);
  const { groups } = useContext(GroupContext);
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const [groupSettingsClass, setSettingsClass] = useState("group-settings-container");
  const [groupAddMemberClass, setAddMemberClass] = useState("group-add-container");
  const [groupMembers, setMembers] = useState([]);
  const [groupMembersNames, setNames] = useState([]);
  const [message, setMessage] = useState({
    groupId: match.params.id,
    sentById: user._id,
    sentBy: user.firstName,
    body: "",
    dateSent: "",
    timeSent: "",
  });

  /* 
	checks if the current user's id is in the array of members.
	if the user's id is not in the array, then the page is re-directed to "Not Found"
	*/
  useEffect(() => {
    if (!groups.find((group) => group._id === match.params.id)) history.push("/not-found");
    else {
      let groupArray = groups.find((group) => group._id === match.params.id);
      setMembers(groupArray.members);
      setNames(groupArray.members.map((member) => member.firstName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  useEffect(() => {
    if (socket) {
      // join specific socket with groupId
      socket.emit("joinGroup", { groupId: match.params.id });

      /* 
			each time this component is mounted, a new "newMessage" listener will be added to this socket,
			so socket.removeAllListeners is called when the component is unmounted
			*/
      socket.on("newMessage", (message) => {
        addNewMessage(message);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // componentWillUnmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.emit("exitGroup", { groupId: match.params.id });
        socket.removeAllListeners("newMessage");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    clearMessages();
    history.push("/dashboard/messages");
  };

  const handleGroupSettingsClose = () => {
    setSettingsClass("group-settings-container");
  };

  const selectSettings = () => {
    setSettingsClass("group-settings-container show");
  };

  const handleChange = (e) => {
    setMessage({
      ...message,
      body: e.target.value,
    });
  };

  const showAddMember = () => {
    setAddMemberClass("group-add-container show");
  };

  const handleCloseAddMember = () => {
    setAddMemberClass("group-add-container");
  };

  const messageSent = async () => {
    if (message.body.trim().length > 0) {
      if (socket) {
        await socket.emit("sendMessage", {
          message: {
            ...message,
            dateSent: new Date().toLocaleDateString(),
            timeSent: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        });

        setMessage({
          ...message,
          body: "",
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
            <h1 className="group-nav-h1">{groupMembersNames.join(", ")}</h1>
            <div className="group-nav-add" onClick={showAddMember}>
              &#65291;
            </div>
          </div>
          <div className="group-nav-settings-button" onClick={selectSettings}>
            ⚙️
          </div>
        </div>

        <div className="text-box-container">
          <RenderMessages />
        </div>

        <div className="group-footer">
          <textarea
            className="group-textarea"
            cols="50"
            value={message.body}
            onChange={handleChange}
          />
          <button className="group-send-button" onClick={messageSent}>
            Send
          </button>
        </div>
      </div>

      <GroupSettings
        groupSettingsContainer={groupSettingsClass}
        closeGroupSettings={handleGroupSettingsClose}
        groupId={match.params.id}
        groupMembers={groupMembers}
        history={history}
      />

      <GroupAddMember
        groupAddContainer={groupAddMemberClass}
        groupId={match.params.id}
        closeAddMember={handleCloseAddMember}
        groupMembers={groupMembers}
      />
    </div>
  );
}

export default Group;
