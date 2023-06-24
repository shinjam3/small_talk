import React, { createContext, useReducer } from 'react';
import messagesReducer from '../reducers/messagesReducer';

const initialState = {
  messages: [],
};

export const MessagesContext = createContext(initialState);

// provider component
export const MessagesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messagesReducer, initialState);

  //actions
  const getMessages = async (groupId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/messages`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ groupId, preview: false }),
    });
    const resJson = await res.json();
    dispatch({
      type: 'GET_MESSAGES',
      payload: resJson,
    });
  };

  function clearMessages() {
    dispatch({
      type: 'GET_MESSAGES',
      payload: [],
    });
  }

  function addNewMessage(message) {
    dispatch({
      type: 'ADD_TO_MESSAGES',
      payload: message,
    });
  }

  return (
    <MessagesContext.Provider
      value={{
        messages: state.messages,
        getMessages,
        clearMessages,
        addNewMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
