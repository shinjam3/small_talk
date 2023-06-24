import React, { createContext, useReducer } from 'react';
import socketReducer from '../reducers/socketReducer';
import io from 'socket.io-client';

const initialState = {
  socket: {},
};

export const SocketContext = createContext(initialState);

// provider component
export const SocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);

  //actions
  const createSocket = () => {
    const newSocket = io(process.env.REACT_APP_API_URL, {
      withCredentials: true,
    });
    dispatch({
      type: 'SET_SOCKET',
      payload: newSocket,
    });
  };

  const clearSocket = () => {
    dispatch({
      type: 'SET_SOCKET',
      payload: {},
    });
  };

  return (
    <SocketContext.Provider value={{ socket: state.socket, createSocket, clearSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
