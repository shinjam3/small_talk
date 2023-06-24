import React from 'react';
import ConnectItem from './ConnectItem';

function RenderConnectItems({ users }) {
  return users.map((user) => <ConnectItem key={user._id} otherUser={user} />);
}

export default RenderConnectItems;
