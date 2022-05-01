import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import RenderNotifications from "./RenderNotifications";

function Notifications() {
  const { user, getCurrentUserInfo } = useContext(UserContext);
  const [notificationContainerClass, setContainerClass] = useState("notification-container");
  const [noNotificationsClass, setNoClass] = useState("no-notifications");

  useEffect(() => {
    getCurrentUserInfo(user._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user.notifications.length) {
      setContainerClass("notification-container hide");
      setNoClass("no-notifications show");
    } else {
      setContainerClass("notification-container");
      setNoClass("no-notifications");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      <h1 className="st-h1">Notifications</h1>

      <div className={notificationContainerClass}>
        <RenderNotifications notifications={user.notifications} />
      </div>

      <p className={noNotificationsClass}>No Notifications</p>
    </div>
  );
}

export default Notifications;
