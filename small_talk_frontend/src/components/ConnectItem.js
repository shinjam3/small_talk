import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import silhouette from "../media/silhouette.png";

function ConnectItem({ otherUser }) {
  const { user } = useContext(UserContext);
  const [buttonText, setButtonText] = useState("Send Friend Request");
  const [buttonDisabled, setDisabled] = useState(false);

  useEffect(() => {
    if (otherUser.isFriend) {
      setButtonText("Already Friend");
      setDisabled(true);
    }
  }, [otherUser]);

  // first param is user to, second param is user from
  const handleClick = () => {
    fetch(
      `${process.env.REACT_APP_API_URL}/users/send-friend-request/${otherUser._id}/${user._id}`,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-auth-token": localStorage.getItem("token"),
        },
        method: "PUT",
      }
    ).then((res) => {
      if (res.ok) {
        setButtonText("Friend Request Sent");
        setDisabled(true);
      }
    });
  };

  return (
    <div>
      <div className="connect-user">
        <img className="connect-img" src={silhouette} alt="profile silhouette" />
        <p className="connect-user-name">{otherUser.firstName + " " + otherUser.lastName}</p>
        <button className="connect-user-button" disabled={buttonDisabled} onClick={handleClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default ConnectItem;
