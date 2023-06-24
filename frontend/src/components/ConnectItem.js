import React, { useState, useEffect } from "react";
import silhouette from "../media/silhouette.png";

function ConnectItem({ otherUser }) {
  const [buttonText, setButtonText] = useState("Send Friend Request");
  const [buttonDisabled, setDisabled] = useState(false);

  useEffect(() => {
    if (otherUser.isFriend) {
      setButtonText("Already Friend");
      setDisabled(true);
    }
  }, [otherUser]);

  const handleClick = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/users/send-friend-request/`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: 'include',
        method: "POST",
        body: JSON.stringify({otherUserId: otherUser._id})
      },
    );
    if (res.ok) {
      setButtonText("Friend Request Sent");
      setDisabled(true);
    }
  };

  return (
    <div>
      <div className="connect-user">
        <img
          className="connect-img"
          src={silhouette}
          alt="profile silhouette"
        />
        <p className="connect-user-name">
          {otherUser.firstName + " " + otherUser.lastName}
        </p>
        <button
          className="connect-user-button"
          disabled={buttonDisabled}
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default ConnectItem;
