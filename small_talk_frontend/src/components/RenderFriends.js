import React from "react";
import FriendItem from "./FriendItem";

function RenderFriends({ friends, history }) {
  return friends.map((friend) => <FriendItem key={friend._id} friend={friend} history={history} />);
}

export default RenderFriends;
