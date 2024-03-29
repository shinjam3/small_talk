import React, { useContext } from 'react';
import { GroupContext } from '../contexts/GroupContext';
import GroupItem from './GroupItem';

function RenderGroups() {
  const { groups } = useContext(GroupContext);
  return groups.map((group) => <GroupItem group={group} key={group._id} />);
}

export default RenderGroups;
