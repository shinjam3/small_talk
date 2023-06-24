import React, { createContext, useReducer } from 'react';
import groupReducer from '../reducers/groupReducer';

const initialState = {
  groups: [],
};

export const GroupContext = createContext(initialState);

// provider component
export const GroupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(groupReducer, initialState);

  //actions
  const getGroups = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/groups`, {
      credentials: 'include',
    });
    const resJson = await res.json();
    dispatch({
      type: 'GET_GROUPS',
      payload: resJson,
    });
    return resJson.length;
  };

  const createNewGroup = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/groups/create-group`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
    });
    const resJson = await res.json();
    dispatch({
      type: 'ADD_TO_GROUPS',
      payload: resJson,
    });
  };

  const addToGroups = (group) => {
    dispatch({
      type: 'ADD_TO_GROUPS',
      payload: group,
    });
  };

  const leaveGroup = async (groupId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/groups/leave-group`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ groupId }),
    });
    const resJson = await res.json();
    dispatch({
      type: 'GET_GROUPS',
      payload: resJson,
    });
  };

  return (
    <GroupContext.Provider
      value={{
        groups: state.groups,
        getGroups,
        createNewGroup,
        addToGroups,
        leaveGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
