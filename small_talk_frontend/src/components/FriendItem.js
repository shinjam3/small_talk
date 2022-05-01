import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { GroupContext } from "../contexts/GroupContext";
import silhouette from "../media/silhouette.png";

function FriendItem({ friend, history }) {
  const { user, removeFriend } = useContext(UserContext);
  const { addToGroups } = useContext(GroupContext);
  const [warningClass, setWarning] = useState("delete-friend-warning");

  const createGroup = () => {
    fetch(
      `${process.env.REACT_APP_API_URL}/groups/create-group-with-friend/${user._id}/${friend._id}`,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-auth-token": localStorage.getItem("token"),
        },
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        addToGroups(res);
        return res;
      })
      .then((res) => history.push(`/group/${res._id}`));
  };

  const showWarning = () => {
    setWarning("delete-friend-warning show");
  };

  const cancelClick = () => {
    setWarning("delete-friend-warning");
  };

  const confirmClick = () => {
    removeFriend(friend._id, user._id);
  };

  return (
    <div>
      <div className="connect-user">
        <img className="connect-img" src={silhouette} alt="profile silhouette" />
        <p className="connect-user-name">{friend.firstName + " " + friend.lastName}</p>
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
