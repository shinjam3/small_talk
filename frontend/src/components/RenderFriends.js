import React from 'react';
import FriendItem from './FriendItem';

function RenderFriends({ friends }) {
  return friends.map((friend) => (
    <FriendItem key={friend._id} friend={friend} />
  ));
}

export default RenderFriends;
